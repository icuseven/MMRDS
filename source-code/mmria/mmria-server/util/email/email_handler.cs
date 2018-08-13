using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Configuration;

namespace mmria.server.util.email
{

	public class Email_Handler
	{ 

		/// <summary>
		/// the following method takes email and responseUrl as argument and email redirection url to the user 
		/// </summary>
		/// <param name="emailAddress">email address for sending message (email is NOT saved)</param>
		/// <param name="redirectUrl">url for resuming the saved survey</param>
		/// <param name="surveyName">Name of the survey</param>
		/// <param name="passCode"> Code for accessing an unfinished survey </param>
		/// <returns></returns>

        private IConfiguration Configuration;
        public Email_Handler(IConfiguration configuration)
        {
            Configuration = configuration;
        }


		public bool SendMessage( Email Email)
		{
			try
			{
				bool isAuthenticated = false;
				bool isUsingSSL = false;
				int SMTPPort = 25;

				// App Config Settings:
				// EMAIL_USE_AUTHENTICATION [ True | False ] default is False
				// EMAIL_USE_SSL [ True | False] default is False
				// SMTP_HOST [ url or ip address of smtp server ]
				// SMTP_PORT [ port number to use ] default is 25
				// EMAIL_FROM [ email address of sender and authenticator ]
				// EMAIL_PASSWORD [ password of sender and authenticator ]


/*
                var EmailObj = new Common.Email.Email();
                EmailObj.Body = redirectUrl + " and Pass Code is: " + passCode;
                EmailObj.From = ConfigurationManager.AppSettings["EMAIL_FROM"].ToString();
                EmailObj.Subject = Uri.UnescapeDataString(emailSubject);
                List<string> tempList = new List<string>();
                tempList.Add(emailAddress);
                EmailObj.To = tempList;

                if (new Email_Handler().SendMessage(EmailObj))
                {
                    return Json(true);
                }
                else
                {
                    return Json(false);
                }



               var Email = new Email();
               Email.Body = "The following survey has been promoted to FINAL mode:\n Title:" + SurveyInfo.SurveyName + " \n Survey ID:" + SurveyInfo.SurveyId + " \nOrganization:" + SurveyInfo.OrganizationName + "\n Start Date & Time:" + SurveyInfo.StartDate + "\n Closing Date & Time:" + SurveyInfo.ClosingDate + " \n \n \n  Thank you.";
               Email.From = ConfigurationManager.AppSettings["EMAIL_FROM"];
               Email.To = AdminList;
               Email.Subject = "Survey -" + SurveyInfo.SurveyName + " has been promoted to FINAL";
               bool success = Epi.Web.Common.Email.EmailHandler.SendMessage(Email);


              var Email = new Email();
              Email.Body = "Organization Name:" + Organization.Organization + "\nOrganization Key: " + strOrgKeyDecrypted + "\nAdmin Email: " + AdminBO.AdminEmail + "\n\nThank you.";
              Email.From = ConfigurationManager.AppSettings["EMAIL_FROM"];
              Email.To = AdminList;
              Email.Subject = "An organization account has been created.";
              if (AdminList.Count() > 0)
                  {
                  bool success = new Email_Handler().SendMessage(Email);
                  }


			EmailObj.Body = Body +
				"\n\n Survey URL: \n" + SurveyUrl;

			EmailObj.From = Sender;// ConfigurationManager.AppSettings["EMAIL_FROM"].ToString();
			EmailObj.Subject = Uri.UnescapeDataString(Subject);


			List<string> tempList = new List<string>();
			tempList.Add(UserEamil);
			EmailObj.To = tempList;
			bool EmailSent = new Email_Handler().SendMessage(EmailObj);



			try
			{
				EmailObj.Body = Body2 +
						"\n\n Survey URL: \n" + SurveyUrl;
				EmailObj.Subject = Uri.UnescapeDataString(Subject2);
				EmailObj.From = Sender2;// ConfigurationManager.AppSettings["EMAIL_FROM"].ToString();
				List<string> tempList = new List<string>();
				tempList.Add(UserEamil);
				EmailObj.To = tempList;
				bool EmailSent = new Email_Handler().SendMessage(EmailObj);
				xlWorksheet.SetValue(row, 8, "Email sent successfully!");

			}
			catch (Exception ex)
			{
				xlWorksheet.SetValue(row, 8, "Error occurred while sending email.");
				//throw ex;
			}



 */

				string s = this.Configuration["mmria_settings:EMAIL_USE_AUTHENTICATION"];
				if (!String.IsNullOrEmpty(s))
				{
					if (s.ToUpper() == "TRUE")
					{
						isAuthenticated = true;
					}
				}

				s = this.Configuration["mmria_settings:EMAIL_USE_SSL"];
				if (!String.IsNullOrEmpty(s))
				{
					if (s.ToUpper() == "TRUE")
					{
						isUsingSSL = true;
					}
				}

				s = this.Configuration["mmria_settings:SMTP_PORT"];
				if (!int.TryParse(s, out SMTPPort))
				{
					SMTPPort = 25;
				}

				System.Net.Mail.MailMessage message = new System.Net.Mail.MailMessage();
				foreach (string item in Email.To)
				{
					message.To.Add(item);
				}

				message.Subject = Email.Subject;
				message.From =  new System.Net.Mail.MailAddress(Email.From.ToString());
				message.Body = Email.Body;  
				System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient(this.Configuration["mmria_settings:SMTP_HOST"].ToString());
				smtp.Port = SMTPPort;

				if (isAuthenticated)
				{
					smtp.Credentials = new System.Net.NetworkCredential(this.Configuration["mmria_settings:EMAIL_FROM"].ToString(), this.Configuration["mmria_settings:EMAIL_PASSWORD"].ToString());
				}


				smtp.EnableSsl = isUsingSSL;


				smtp.Send(message);

				return true;

			}
			catch (System.Exception ex)
			{
				return false;
			}
		}

	}



}

