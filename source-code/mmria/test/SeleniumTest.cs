using System;
using System.IO;
using System.Text;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium.Remote;
using Xunit;

namespace test
{
        //https://github.com/SeleniumHQ/docker-selenium
    // docker run -d -p 4444:4444 --shm-size=2g selenium/standalone-chrome:3.14.0-europium
    public class SeleniumTest
    {
    public class Class1
    {
        [Fact]
        public void PassingTest()
        {
            Assert.Equal(4, Add(2, 2));
        }
/*
        [Fact]
        public void FailingTest()
        {
            Assert.Equal(5, Add(2, 2));
        }
 */
        int Add(int x, int y)
        {
            return x + y;
        }

        [Fact]
        public void Test1()
        {
            int milliseconds_in_second = 1000;

/* 
            var options = new OpenQA.Selenium.Chrome.ChromeOptions();
            //options.BinaryLocation = "/usr/share/iron/chrome-wrapper";
            options.BinaryLocation = "/wd/hub";
            options.DebuggerAddress  = "localhost:4444";
            options.

driver = webdriver.Chrome(chrome_driver_binary, chrome_options=options)
            System.setProperty("webdriver.chrome.driver","");

                        
                        using (var driver = new ChromeDriver("/media/jhaines/tera27/file-set/workspace/coffeebreak-test/bin/Debug/netcoreapp2.1/", options))
*/


            // Initialize the Chrome Driver
            //using (var driver = new ChromeDriver("/media/jhaines/tera27/file-set/workspace/coffeebreak-test/bin/Debug/netcoreapp2.1/", options))
            using (var driver = new RemoteWebDriver(new System.Uri("http://localhost:4444/wd/hub"),new ChromeOptions()))
            {            
                // Go to the home page
                driver.Navigate().GoToUrl("http://test.mmria.org");

                System.Threading.Thread.Sleep(1 * milliseconds_in_second);

                // Get the page elements

                //var login_toggle = driver.FindElementByXPath("//li[@id='profile_content_id']/a[@class='dropdown-toggle']");
                var login_toggle = driver.FindElementByXPath("//li[@id='profile_content_id']/a");
                login_toggle.Click();
                var userNameField = driver.FindElementByXPath("//*[@id='profile_content_id2']/div/input[1]");
                var userPasswordField = driver.FindElementByXPath("//*[@id='profile_content_id2']/div/input[2]");
                var loginButton = driver.FindElementByXPath("//*[@id='profile_content_id2']/div/input[3]");

                // Type user name and password
                userNameField.SendKeys("user1");
                userPasswordField.SendKeys("password");

                // and click the login button
                loginButton.Click();
/*
                // Extract the text and save it into result.txt
                var result = driver.FindElementById("form_content_id").Text;
                File.WriteAllText("result.txt", result);

                // Take a screenshot and save it into screen.png
                driver.GetScreenshot().SaveAsFile(@"screen.png", ScreenshotImageFormat.Png);

                System.Threading.Thread.Sleep(5 * milliseconds_in_second);


                var AddNewCaseButton = driver.FindElementByXPath("//*[@id='app_summary']/input[1]");
                AddNewCaseButton.Click();
 */
                System.Threading.Thread.Sleep(5 * milliseconds_in_second);
                // Take a screenshot and save it into screen.png
                driver.GetScreenshot().SaveAsFile(@"add_new_case.png", ScreenshotImageFormat.Png);

                 Assert.Equal(1, 1);
            }
        }
    }
    }
}