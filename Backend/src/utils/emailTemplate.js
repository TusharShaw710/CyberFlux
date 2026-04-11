export const cyberfluxTemplate = ({ message }) => {
  return `
  <!DOCTYPE html>
  <html>
    <body style="margin:0; padding:0; background-color:#0D0D12; font-family:Arial, sans-serif;">
      
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            
            <table width="600" cellpadding="0" cellspacing="0" style="background:#111118; border-radius:12px; padding:20px; border:1px solid rgba(255,255,255,0.08);">
              
              <!-- Header -->
              <tr>
                <td style="text-align:center; padding-bottom:20px;">
                  <h1 style="color:#3D5AFE; margin:0;">⚡ Cyberflux</h1>
                  <p style="color:#aaa; font-size:14px;">AI-powered response</p>
                </td>
              </tr>

              <!-- Answer -->
              <tr>
                <td style="padding:10px 0; color:#ddd; font-size:15px; line-height:1.6;">
                    <p style="color:#888; font-size:12px;">RESPONSE</p>
                    <div style="margin-top:10px;">
                        ${message}
                    </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding-top:20px; text-align:center;">
                  <p style="color:#666; font-size:12px;">
                    Sent via Cyberflux ⚡
                  </p>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
  </html>
  `;
};