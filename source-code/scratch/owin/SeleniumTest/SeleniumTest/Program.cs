using System;
using System.IO;
using System.Text;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

namespace SeleniumTest
{
    class MainClass
    {
        public static void Main(string[] args)
        {
            // Initialize the Chrome Driver
            using (var driver = new ChromeDriver())
            {
                // Go to the home page
                driver.Navigate().GoToUrl("http://test.mmria.org");

                // Get the page elements

                var login_toggle = driver.FindElementByXPath("//li[@id='profile_content_id']/a[@class='dropdown-toggle']");
                login_toggle.Click();
                var userNameField = driver.FindElementById("profile_form_user_name");
                var userPasswordField = driver.FindElementById("profile_form_password");
                var loginButton = driver.FindElementByXPath("//input[@value='Log in']");

                // Type user name and password
                userNameField.SendKeys("user1");
                userPasswordField.SendKeys("password");

                // and click the login button
                loginButton.Click();

                // Extract the text and save it into result.txt
                var result = driver.FindElementById("form_content_id").Text;
                File.WriteAllText("result.txt", result);

                // Take a screenshot and save it into screen.png
                driver.GetScreenshot().SaveAsFile(@"screen.png", ScreenshotImageFormat.Png);
            }
        }


        public static void example_webscraping(string[] args)
        {
            //http://scraping.pro/example-of-scraping-with-selenium-webdriver-in-csharp/
            // Initialize the Chrome Driver
            using (var driver = new ChromeDriver())
            {
                // Go to the home page
                driver.Navigate().GoToUrl("http://testing-ground.scraping.pro/login");

                // Get the page elements
                var userNameField = driver.FindElementById("usr");
                var userPasswordField = driver.FindElementById("pwd");
                var loginButton = driver.FindElementByXPath("//input[@value='Login']");

                // Type user name and password
                userNameField.SendKeys("admin");
                userPasswordField.SendKeys("12345");

                // and click the login button
                loginButton.Click();

                // Extract the text and save it into result.txt
                var result = driver.FindElementByXPath("//div[@id='case_login']/h3").Text;
                File.WriteAllText("result.txt", result);

                // Take a screenshot and save it into screen.png
                driver.GetScreenshot().SaveAsFile(@"screen.png", ScreenshotImageFormat.Png);
            }
        }
    }
}
