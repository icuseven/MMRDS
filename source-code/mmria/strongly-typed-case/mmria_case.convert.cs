
using System;
using System.Collections.Generic;

namespace mmria.case_version.v1;

public sealed partial class mmria_case
{
    /*
    public mmria_case Convert(System.Dynamic.ExpandoObject value)
    {
        
        mmria_case result = new mmria_case();

        IDictionary<string,object> d = value as IDictionary<string,object>;
        if(d != null)
        {
          DateOnly? x = DateOnly.TryParse("", out var data) ? data : null;
        }

        return result;
    }*/

    public static string  GetStringField(IDictionary<string,object> d, string key)
    {
        string result = null;

        if(d.ContainsKey(key)  && d[key] != null)
        {
            result = d[key].ToString();
            //result = DateOnly.TryParse("", out var data) ? data : null;
        }

        return result;
    }


    public static T?  GetListField<T>(IDictionary<string,object> d, string key)
    {
        T? result = default(T);

        if(d.ContainsKey(key) && d[key] != null)
        {
            result = (T)d[key];

            //result = DateOnly.TryParse("", out var data) ? data : null;
        }

        return result;
    }


    public static List<T>?  GetMultiSelectListField<T>(IDictionary<string,object> d, string key)
    {
        List<T>? result = null;

        if(d.ContainsKey(key) && d[key] != null)
        {
            result = d[key] as List<T>;

            //result = DateOnly.TryParse("", out var data) ? data : null;
        }

        return result;
    }

    public static T?  GetFormField<T>(IDictionary<string,object> d, string key)
    {
        T? result = default(T);

        if(d.ContainsKey(key) && d[key] != null)
        {
            result = (T)d[key];

            //result = DateOnly.TryParse("", out var data) ? data : null;
        }

        return result;
    }


    public static List<T>?  GetMultiFormField<T>(IDictionary<string,object> d, string key)
    {
        List<T>? result = null;

        if(d.ContainsKey(key))
        {
            result = d[key] as List<T>;

            //result = DateOnly.TryParse("", out var data) ? data : null;
        }

        return result;
    }
    
/*

    public static List<T>  GetList<T>(IDictionary<string,object> d, string key)
    {
        DateOnly? result = null;

        if(d.ContainsKey(key))
        {
            result = d[key] as DateOnly?;

            //result = DateOnly.TryParse("", out var data) ? data : null;
        }

        return result;
    }

    public static List<T>  GetList<T>(IDictionary<string,object> d, string key)
    {
        DateOnly? result = null;

        if(d.ContainsKey(key))
        {
            result = d[key] as DateOnly?;

            //result = DateOnly.TryParse("", out var data) ? data : null;
        }

        return result;
    }
*/
    //case "jurisdiction":
    public static string  GetJurisctionField(IDictionary<string,object> d, string key)
    {
        string result = null;

        if(d.ContainsKey(key)  && d[key] != null)
        {
            result = d[key].ToString();
            //result = DateOnly.TryParse("", out var data) ? data : null;
        }

        return result;
    }
    //case "hidden":
    public static string  GetHiddenField(IDictionary<string,object> d, string key)
    {
        string result = null;

        if(d.ContainsKey(key)  && d[key] != null)
        {
            result = d[key].ToString();
            //result = DateOnly.TryParse("", out var data) ? data : null;
        }

        return result;
    }
    //case "textarea":
   public static string  GetTextAreaField(IDictionary<string,object> d, string key)
    {
        string result = null;

        if(d.ContainsKey(key)  && d[key] != null)
        {
            result = d[key].ToString();
            //result = DateOnly.TryParse("", out var data) ? data : null;
        }

        return result;
    }
    //case "date":
    public static DateOnly?  GetDateField(IDictionary<string,object> d, string key)
    {
        DateOnly? result = null;

        if(d.ContainsKey(key) && d[key] != null)
        {
            if(DateOnly.TryParse(d[key].ToString(), out var test))
            {
                result = test;
            }
        }

        return result;
    }

    //case "number":
   public static double?  GetNumberField(IDictionary<string,object> d, string key)
    {
        double? result = null;

        if(d.ContainsKey(key) && d[key] != null)
        {
            if(double.TryParse(d[key].ToString(), out var test))
            {
                result = test;
            }
        }

        return result;
    }
    
    //case "time":
    public static TimeOnly?  GetTimeField(IDictionary<string,object> d, string key)
    {
        TimeOnly? result = null;

        if(d.ContainsKey(key) && d[key] != null)
        {
            if(TimeOnly.TryParse(d[key].ToString(), out var test))
            {
                result = test;
            }
        }

        return result;
    }
    //case "datetime":
    public static DateTime?  GetDateTimeField(IDictionary<string,object> d, string key)
    {
        DateTime? result = null;

        if(d.ContainsKey(key) && d[key] != null)
        {
            if(DateTime.TryParse(d[key].ToString(), out var test))
            {
                result = test;
            }
        }

        return result;
    }


}