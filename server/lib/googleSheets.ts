// Google Sheets integration for burn request tracking
// Uses Replit's Google Sheets connector for authentication

import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Sheet not connected');
  }
  return accessToken;
}

async function getUncachableGoogleSheetClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.sheets({ version: 'v4', auth: oauth2Client });
}

export interface BurnRecord {
  id: string;
  walletAddress: string;
  email: string;
  discord: string;
  nftMints: string[];
  nftCount: number;
  discountPercent: number;
  discountCode: string | null;
  txSignature: string | null;
  status: string;
  createdAt: Date;
}

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function appendBurnRecord(record: BurnRecord): Promise<void> {
  if (!SHEET_ID) {
    console.warn('GOOGLE_SHEET_ID not configured, skipping sheet update');
    return;
  }

  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    const values = [[
      record.id,
      record.walletAddress,
      record.email,
      record.discord,
      record.nftMints.join(', '),
      record.nftCount,
      record.discountPercent,
      record.discountCode || '',
      record.txSignature || '',
      record.status,
      record.createdAt.toISOString(),
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'BurnRequests!A:K',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
    
    console.log(`Appended burn record ${record.id} to Google Sheet`);
  } catch (error) {
    console.error('Failed to append to Google Sheet:', error);
  }
}

export async function updateBurnRecord(
  recordId: string,
  updates: { txSignature?: string; status?: string; discountCode?: string }
): Promise<void> {
  if (!SHEET_ID) {
    console.warn('GOOGLE_SHEET_ID not configured, skipping sheet update');
    return;
  }

  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'BurnRequests!A:K',
    });

    const rows = response.data.values || [];
    let rowIndex = -1;
    
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === String(recordId)) {
        rowIndex = i + 1;
        break;
      }
    }

    if (rowIndex === -1) {
      console.warn(`Record ${recordId} not found in Google Sheet`);
      return;
    }

    const updateRequests: any[] = [];
    
    if (updates.discountCode !== undefined) {
      updateRequests.push({
        range: `BurnRequests!H${rowIndex}`,
        values: [[updates.discountCode]],
      });
    }
    
    if (updates.txSignature !== undefined) {
      updateRequests.push({
        range: `BurnRequests!I${rowIndex}`,
        values: [[updates.txSignature]],
      });
    }
    
    if (updates.status !== undefined) {
      updateRequests.push({
        range: `BurnRequests!J${rowIndex}`,
        values: [[updates.status]],
      });
    }

    if (updateRequests.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          valueInputOption: 'USER_ENTERED',
          data: updateRequests,
        },
      });
      
      console.log(`Updated burn record ${recordId} in Google Sheet`);
    }
  } catch (error) {
    console.error('Failed to update Google Sheet:', error);
  }
}

export async function initializeSheet(): Promise<void> {
  if (!SHEET_ID) {
    console.warn('GOOGLE_SHEET_ID not configured - Google Sheets integration disabled');
    return;
  }

  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'BurnRequests!A1:K1',
    });

    if (!response.data.values || response.data.values.length === 0) {
      const headers = [[
        'ID',
        'Wallet Address',
        'Email',
        'Discord',
        'NFT Mints',
        'NFT Count',
        'Discount %',
        'Discount Code',
        'TX Signature',
        'Status',
        'Created At',
      ]];

      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: 'BurnRequests!A1:K1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: headers },
      });
      
      console.log('Initialized Google Sheet headers');
    } else {
      console.log('Google Sheets connected successfully');
    }
  } catch (error: any) {
    if (error?.status === 403 || error?.code === 403) {
      console.warn('Google Sheets permission denied - the connector may not have spreadsheet access. Records will be stored in the database only.');
    } else {
      console.error('Failed to initialize Google Sheet:', error?.message || error);
    }
  }
}
