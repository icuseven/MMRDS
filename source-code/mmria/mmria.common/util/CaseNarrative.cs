using System;
using System.Text.RegularExpressions;



namespace mmria.common.util
{
    public static class CaseNarrative
    {
        

        public static string StripHtmlAttributes(string value)
        {

            Regex AttributeRegEx = new Regex
            (
                "[a-zA-Z]+='[^']+'|[a-zA-Z]+=\"[^\"]+\"",
                
                RegexOptions.IgnoreCase | RegexOptions.Multiline
            );

            Regex PseudoTagRegex = new Regex
            (
                @"<\/?[a-z]:[^>]+>",
                
                RegexOptions.IgnoreCase | RegexOptions.Multiline
            );

            Regex CommentRegex = new Regex
            (
                @"<!--\[[^>]+>",
                
                RegexOptions.IgnoreCase | RegexOptions.Multiline
            );

            Regex StripHTMLExp = new Regex
            (
                @"(<\/?[^>]+>)",
                
                RegexOptions.IgnoreCase | RegexOptions.Multiline
            );


            return CommentRegex.Replace(PseudoTagRegex.Replace(AttributeRegEx.Replace(value,""), ""),"");
        }
        public static string StripHtmlAttributes2(string value)
        {
            //string result = "bubba";
            
            //return result;


            int startindex = value.IndexOf('<');
            int endindex = value.IndexOf('>');
            string tag = value.Substring((startindex + 1), (endindex - startindex - 1));
            int spaceindex = tag.IndexOf(' ');
            if (spaceindex > 0)
                tag = tag.Substring(0, spaceindex);
            return String.Concat('<', tag, value.Substring(endindex));
        }

        public static string FnRemoveHTML(string sString)
        {
            System.Text.RegularExpressions.Regex oRegEx = new 
            (
                "<!*[^<>]*>",
                System.Text.RegularExpressions.RegexOptions.IgnoreCase |System.Text.RegularExpressions.RegexOptions.Multiline
            );



            /*
                .Pattern = 
                .Global = True
                .IgnoreCase = True
                .MultiLine = True
                */
            var result = oRegEx.Replace(sString, "");
            result = result.Replace("&nbsp;", "\n").Replace("&quot;", "'").Replace("\\", "<\\");
                result = result.Replace("&gt;", ">").Replace("&lt;", "<").Replace("&amp;", "&");
                
            //result = FnRemoveLineBreak(result);

            return result;
        /* 
            FnRemoveHTML = oRegEx.Replace(sString, "");
            FnRemoveHTML = Replace(Replace(Replace(FnRemoveHTML, "&nbsp;", vbCrLf, 1, -1), "&quot;", "'", 1, -1), "\\", "<\\", 1, -1);
            FnRemoveHTML = Replace(Replace(Replace(FnRemoveHTML, "&gt;", ">", 1, -1), "&lt;", "<", 1, -1), "&amp;", "&", 1, -1);
            FnRemoveHTML = FnRemoveLineBreak(FnRemoveHTML);
        
            Error_Handler_Exit:
            On Error Resume Next
            Set oRegEx = Nothing*/
        }
 
    }

}