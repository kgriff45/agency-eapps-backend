
function EmailTemplate(bodyHtml = '') {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>PRA Agency</title>
      <style type="text/css">
        body { margin: 0; padding: 0; background: #f9fafb; }
        img  { border: 0; display: block; }
        a    { color: #156736; }

        /* Mobile */
        @media only screen and (max-width: 600px) {
          .container  { width: 100% !important; }
          .inner-pad  { padding: 24px !important; }
          .footer-col { display: block !important; width: 100% !important; }
          .footer-left { margin-bottom: 16px !important; }
          .footer-right { text-align: left !important; }
        }
      </style>
    </head>

    <body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding:40px 16px;">

            <!-- Outer container -->
            <table class="container" role="presentation" width="600" cellspacing="0" cellpadding="0"
                  style="width:600px;max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;">

              <!-- Brand top bar -->
              <tr>
                <td style="background:#156736;height:4px;font-size:0;line-height:0;">&nbsp;</td>
              </tr>

              <!-- Logo header -->
              <tr>
                <td class="inner-pad" style="padding:32px 40px 24px;">
                  <img
                    src="https://info.picagroup.com/hs-fs/hubfs/PRA-Agency-Logo%C2%AE-RGB.png?width=400&height=116&name=PRA-Agency-Logo%C2%AE-RGB.png"
                    alt="PRA Agency"
                    height="72"
                    style="display:block;border:0;height:72px;width:auto;"
                  />
                </td>
              </tr>

              <!-- Dynamic body -->
              <tr>
                <td class="inner-pad" style="padding:0 40px 40px;">
                  ${bodyHtml}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td class="inner-pad" style="padding:28px 40px 36px;border-top:1px solid #e5e7eb;background:#f9fafb;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <!-- Left: company info -->
                      <td class="footer-col footer-left" style="vertical-align:top;width:60%;">
                        <p style="margin:0 0 4px;color:#374151;font-size:13px;font-weight:600;">ProAssurance Agency</p>
                        <p style="margin:0 0 2px;color:#9ca3af;font-size:12px;">Birmingham, AL</p>
                        <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} All rights reserved</p>
                      </td>

                      <!-- Right: support button -->
                      <td class="footer-col footer-right" align="right" style="vertical-align:top;width:40%;">
                        <a href="mailto:praagency@proassurance.com"
                          style="display:inline-block;padding:9px 18px;border:1px solid #d1d5db;border-radius:6px;color:#374151;font-size:12px;font-weight:500;text-decoration:none;white-space:nowrap;">
                          Contact Agency
                        </a>
                      </td>
                    </tr>

                    <!-- Disclaimer -->
                    <tr>
                      <td colspan="2" style="padding-top:16px;">
                        <p style="margin:0;color:#d1d5db;font-size:11px;line-height:1.5;">
                          This email and any attachments are confidential and intended solely for the named recipient.
                          Final policy terms are governed by the issued policy forms and carrier agreements.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
    `
    }

module.exports = { EmailTemplate }