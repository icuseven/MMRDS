
using System;
using System.Collections.Generic;

namespace mmria.case_version.v1;

public interface IConvertDictionary
{
    public void Convert(System.Text.Json.JsonElement value);
}



public sealed partial class mmria_case
{
    /*
    public mmria_case Convert(System.Dynamic.ExpandoObject value)
    {
        
        mmria_case result = new mmria_case();

        System.Text.Json.JsonElement d = value as System.Text.Json.JsonElement;
        if(d != null)
        {
          DateOnly? x = DateOnly.TryParse("", out var data) ? data : null;
        }

        return result;
    }*/

    public static string?  GetStringField(System.Text.Json.JsonElement value, string key)
    {
        string? result = null;

        if
        (
            value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.String
        )
        {
            result = new_value.GetString();
        }

        return result;
    }


    public static string?  GetStringListField(System.Text.Json.JsonElement value, string key)
    {
        string? result = null;

        if
        (
            value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.String
        )
        {
            result = new_value.GetString();
        }
        else
        {
            System.Console.WriteLine("GetStringListField");
        }

        return result;
    }

    public static double?  GetNumberListField(System.Text.Json.JsonElement value, string key)
    {
        double? result = null;

        if
        (
            value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.Number
        )
        {
            result =  new_value.GetDouble();
        }
        else
        {
            System.Console.WriteLine("GetNumberListField");
        }

        return result;
    }


    public static List<string>  GetMultiSelectStringListField(System.Text.Json.JsonElement value, string key)
    {
        List<string> result = null;

        if
        (
            value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.Array
        )
        {
            result = new List<string>();
            /*
            foreach(var item in new_value)
            {

            }*/
            //result = new_value.g.GetDouble();
        }
        else
        {
            System.Console.WriteLine("GetNumberListField");
        }

        return result;
    }

    public static List<double>  GetMultiSelectNumberListField(System.Text.Json.JsonElement value, string key)
    {
        List<double> result = null;

        if
        (
            value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.Number
        )
        {
            result = new List<double>();
           // result = new_value.GetDouble();
        }
        else
        {
            System.Console.WriteLine("GetNumberListField");
        }
        return result;
    }



    public static T?  GetFormField<T>(System.Text.Json.JsonElement value, string key) where T :new()
    {
        T result = default(T);
        if
        (
            value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.Object
        )
        {
            result = new T();
            var con = result as IConvertDictionary;
            if(con != null)
            {
                con.Convert(new_value);
            }
            else
            {
                System.Console.WriteLine("GetFormField");
            }
            
        }
        else
        {
            System.Console.WriteLine("GetFormField");
        }



        return result;
    }

    public static List<T>?  GetMultiFormField<T>(System.Text.Json.JsonElement value, string key)
    {
        List<T>? result = null;

        if
        (
            value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.Array
        )
        {
            result = new();

            var con = result as IConvertDictionary;
            if(con != null)
            {
                con.Convert(new_value);
            }
            else
            {
                System.Console.WriteLine("GetFormField");
            }
            
        }
        else
        {
            System.Console.WriteLine("GetFormField");
        }


        return result;
    }

    //case "jurisdiction":
    public static string  GetJurisdictionField(System.Text.Json.JsonElement value, string key)
    {
        string result = null;

        if
        (
            value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.String
        )
        {
            result = new_value.GetString();
        }
        else
        {
            System.Console.WriteLine("GetJurisdictionField");
        }
        return result;
    }
    //case "hidden":
    public static string  GetHiddenField(System.Text.Json.JsonElement value, string key)
    {
        string result = null;

        if
        (
            value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.String
        )
        {
            result = new_value.GetString();
        }
        else
        {
            System.Console.WriteLine("GetHiddenField");
        }
        return result;
    }
    //case "textarea":
   public static string  GetTextAreaField(System.Text.Json.JsonElement value, string key)
    {
        string result = null;

        if
        (
            value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.String
        )
        {
            result = new_value.GetString();
        }
        else
        {
            System.Console.WriteLine("GetTextAreaField");
        }
        return result;
    }
    //case "date":
    public static DateOnly?  GetDateField(System.Text.Json.JsonElement value, string key)
    {
        DateOnly? result = null;

        if
        (
            value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.String
        )
        {
            if(DateOnly.TryParse(new_value.GetString(), out var test))
            {
                result = test;
            }   
        }
        else
        {
            System.Console.WriteLine("GetDateField");
        }

        return result;
    }

    //case "number":
   public static double?  GetNumberField(System.Text.Json.JsonElement value, string key)
    {
        double? result = null;

        if
        (
            value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.Number
        )
        {
            result = new_value.GetDouble();
        }
        else
        {
            System.Console.WriteLine("GetNumberField");
        }

        return result;
    }
    
    //case "time":
    public static TimeOnly?  GetTimeField(System.Text.Json.JsonElement value, string key)
    {
        TimeOnly? result = null;


        if
        (
            value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.String
        )
        {
            if(TimeOnly.TryParse(new_value.GetString(), out var test))
            {
                result = test;
            }   
        }
        else
        {
            System.Console.WriteLine("GetDateField");
        }

        return result;
    }
    //case "datetime":
    public static DateTime?  GetDateTimeField(System.Text.Json.JsonElement value, string key)
    {
        DateTime? result = null;

        if
        (
            value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.String
        )
        {
            if(DateTime.TryParse(new_value.GetString(), out var test))
            {
                result = test;
            }   
        }
        else
        {
            System.Console.WriteLine("GetDateField");
        }

        return result;
    }


}