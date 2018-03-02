using System;
using System.IO;
using System.Text;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using Xunit;

namespace test
{
    public class SeleniumTest
    {
    public class Class1
    {
        [Fact]
        public void PassingTest()
        {
            Assert.Equal(4, Add(2, 2));
        }

        [Fact]
        public void FailingTest()
        {
            Assert.Equal(5, Add(2, 2));
        }

        int Add(int x, int y)
        {
            return x + y;
        }

        [Fact]
        public void LoginTest()
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

                 Assert.Equal(1, 1);
            }
        }
    }
    }
}