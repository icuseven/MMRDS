using System;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using Xunit;

//https://xunit.github.io/docs/getting-started-dotnet-core.html
namespace SeleniumTest
{
    public class XUnitTest
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
    }
}
