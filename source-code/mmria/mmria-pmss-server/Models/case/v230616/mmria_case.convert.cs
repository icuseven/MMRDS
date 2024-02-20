
using System;
using System.Collections.Generic;

namespace mmria.pmss.case_version.v230616;

public interface IConvertDictionary
{
    public void Convert(System.Text.Json.JsonElement p_value);
}



public sealed partial class mmria_case
{

    public static string?  GetStringField(System.Text.Json.JsonElement value, string key, string path)
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


    public static string?  GetStringListField(System.Text.Json.JsonElement value, string key, string path)
    {
        string? result = null;

        System.Text.Json.JsonElement new_value;

        if(value.TryGetProperty(key, out new_value))
        {
            if
            (
                new_value.ValueKind == System.Text.Json.JsonValueKind.String
            )
            {
                result = new_value.GetString();
            }
            else
            {
                System.Console.WriteLine($"GetStringListField path: {path}");
            }
        }

        return result;
    }

    public static double?  GetNumberListField(System.Text.Json.JsonElement value, string key, string path)
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
        else if
        (
            new_value.ValueKind == System.Text.Json.JsonValueKind.String
        )
        {
            var val = new_value.GetString();
            if(string.IsNullOrWhiteSpace(val))
            {
                // do nothing
            }
            else if(double.TryParse(val, out var test))
            {
                result = test;
            }
            else
            {
                System.Console.WriteLine($"GetNumberListField tryparse failed  path: {path} key:{key} val:{val}");
            }
        }
        else if
        (
            new_value.ValueKind != System.Text.Json.JsonValueKind.Undefined &&
            new_value.ValueKind != System.Text.Json.JsonValueKind.Null
        )
        {
            System.Console.WriteLine("GetNumberListField");
        }

        return result;
    }


    public static List<string>  GetMultiSelectStringListField(System.Text.Json.JsonElement value, string key, string path)
    {
        List<string> result = null;

        if
        (
            value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.Array
        )
        {
            result = new List<string>();
            var max_index = new_value.GetArrayLength();
            for(int i = 0; i < max_index; i++)
            {
                var item = new_value[i];

                if
                (
                    item.ValueKind ==  System.Text.Json.JsonValueKind.String
                )
                {
                    result.Add(item.GetString());
                }
                else
                {
                    System.Console.WriteLine($"GetMultiSelectStringListField need a string  path: {path}");
                }
            }

        }
        else if(new_value.ValueKind != System.Text.Json.JsonValueKind.Undefined)
        {
            System.Console.WriteLine("GetMultiSelectStringListField");
        }

        return result;
    }

    public static List<double>  GetMultiSelectNumberListField(System.Text.Json.JsonElement value, string key, string path)
    {
        List<double> result = null;

        if
        (
            value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.Array
        )
        {
            
            result = new List<double>();
            var max_index = new_value.GetArrayLength();
            for(int i = 0; i < max_index; i++)
            {
                var item = new_value[i];

                if
                (
                    item.ValueKind ==  System.Text.Json.JsonValueKind.Number
                )
                {
                    result.Add(item.GetDouble());
                }
                else if
                (
                    item.ValueKind ==  System.Text.Json.JsonValueKind.String
                )
                {
                    var val = item.GetString();
                    if(string.IsNullOrWhiteSpace(val))
                    {
                        // do nothing
                    }
                    if(double.TryParse(item.GetString(), out var test))
                    {
                         result.Add(test);
                    }
                    else
                    {
                        System.Console.WriteLine($"GetMultiSelectNumberListField TryParse Failed need a number  path: {path} val: {val}");
                    }
                }
                else 
                {
                    System.Console.WriteLine("GetMultiSelectNumberListField need a number");
                }
            }


        }
        else if(new_value.ValueKind != System.Text.Json.JsonValueKind.Undefined)
        {
            System.Console.WriteLine("GetMultiSelectNumberListField");
        }
        return result;
    }



    public static T?  GetFormField<T>(System.Text.Json.JsonElement value, string key, string path) where T :new()
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
                System.Console.WriteLine($"GetFormField  path: {path} key: {key}");
            }
            
        }
        else if(new_value.ValueKind != System.Text.Json.JsonValueKind.Undefined)
        {
            System.Console.WriteLine($"GetFormField path: {path} key: {key}");
        }



        return result;
    }


    public static List<T>?  GetMultiFormField<T>(System.Text.Json.JsonElement value, string key, string path) where T : new()
    {
        List<T>? result = null;

        if
        (
            value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.Array
        )
        {
            result = new();

            var max_index = new_value.GetArrayLength();
            for(var i = 0; i < max_index; i++)
            {
                var item = new_value[i];

                var new_t = new T();
                
                var con = new_t as IConvertDictionary;
                if(con != null)
                {
                    con.Convert(item);

                    result.Add(new_t);
                }
                else if(new_value.ValueKind != System.Text.Json.JsonValueKind.Undefined)
                {
                    System.Console.WriteLine($"GetFormField path: {path} key: {key}");
                }
            }
            
        }
        else if(new_value.ValueKind != System.Text.Json.JsonValueKind.Undefined)
        {
            System.Console.WriteLine($"GetFormField path: {path} key: {key}");
        }


        return result;
    }
    public static T?  GetGroupField<T>(System.Text.Json.JsonElement p_value, string key, string path) where T :new()
    {
        T result = default(T);
        if
        (
            p_value.TryGetProperty(key, out var new_value) &&
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
                System.Console.WriteLine($"GetGroupField path: {path} key: {key}");
            }
            
        }
        else if(new_value.ValueKind != System.Text.Json.JsonValueKind.Undefined)
        {
            System.Console.WriteLine($"GetGroupField path: {path} key: {key}");
        }



        return result;
    }


    public static List<T>?  GetGridField<T>(System.Text.Json.JsonElement p_value, string key, string path) where T : new()
    {
        List<T>? result = null;

        if
        (
            p_value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.Array
        )
        {
            result = new();

            var max_index = new_value.GetArrayLength();
            for(var i = 0; i < max_index; i++)
            {
                var item = new_value[i];

                var new_t = new T();
                
                var con = new_t as IConvertDictionary;
                if(con != null)
                {
                    con.Convert(item);

                    result.Add(new_t);
                }
                else if(new_value.ValueKind != System.Text.Json.JsonValueKind.Undefined)
                {
                    System.Console.WriteLine($"GetGridField path: {path} key: {key}");
                }
            }
            
        }
        else if(new_value.ValueKind != System.Text.Json.JsonValueKind.Undefined)
        {
            System.Console.WriteLine($"GetGridField {path} key: {key}");
        }


        return result;
    }

    //case "jurisdiction":
    public static string  GetJurisdictionField(System.Text.Json.JsonElement value, string key, string path)
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
        else if(new_value.ValueKind != System.Text.Json.JsonValueKind.Undefined)
        {
            System.Console.WriteLine("GetJurisdictionField");
        }
        return result;
    }
    //case "hidden":
    public static string  GetHiddenField(System.Text.Json.JsonElement value, string key, string path)
    {
        string result = null;

        if
        (
            value.TryGetProperty(key, out var new_value)
        )
        {
            if(new_value.ValueKind == System.Text.Json.JsonValueKind.String)
            {
                result = new_value.GetString();
            }
            else if(new_value.ValueKind == System.Text.Json.JsonValueKind.Number)
            {
                result = new_value.GetDouble().ToString();
            }
            else
            {
                System.Console.WriteLine($"GetHiddenField Not a string or number: {path} key: {key}");
            }
                
        }
        else if(new_value.ValueKind != System.Text.Json.JsonValueKind.Undefined)
        {
            System.Console.WriteLine($"GetHiddenField {path} key: {key}");
        }
        
        return result;
    }
    //case "textarea":
   public static string  GetTextAreaField(System.Text.Json.JsonElement value, string key, string path)
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
        else if(new_value.ValueKind != System.Text.Json.JsonValueKind.Undefined)
        {
            System.Console.WriteLine($"GetTextAreaField {path} key: {key}");
        }
        return result;
    }


    //case "number":
   public static double?  GetNumberField(System.Text.Json.JsonElement value, string key, string path)
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
        else if(new_value.ValueKind == System.Text.Json.JsonValueKind.String)
        {
            var val = new_value.GetString();
            
            if(string.IsNullOrWhiteSpace(val))
            {
                // do nothing
            }
            else if(double.TryParse(val, out var test))
            {
                result = test;
            }
            else
            {
                System.Console.WriteLine($"GetNumberField {path} key: {key} val:{val}");
            }
            
        }
        else if
        (
            new_value.ValueKind != System.Text.Json.JsonValueKind.Undefined &&
            new_value.ValueKind != System.Text.Json.JsonValueKind.Null
        )
        {
            System.Console.WriteLine($"GetNumberField {path} key: {key}");
        }

        return result;
    }

        //case "date":
    public static DateOnly?  GetDateField(System.Text.Json.JsonElement value, string key, string path)
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
            else
            {

            }
        }
        else if
        (
            new_value.ValueKind != System.Text.Json.JsonValueKind.Undefined &&
            new_value.ValueKind != System.Text.Json.JsonValueKind.Null
        )
        {
            System.Console.WriteLine($"GetDateField {path} key: {key}");
        }

        return result;
    }
    
    //case "time":
    public static TimeOnly?  GetTimeField(System.Text.Json.JsonElement value, string key, string path)
    {
        TimeOnly? result = null;


        if
        (
            value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.String
        )
        {
            var val = new_value.GetString();
            TimeOnly test;
            if(string.IsNullOrWhiteSpace(val))
            {
                // do nothing
            }
            else if(TimeOnly.TryParse(val, out test))
            {
                result = test;
            }
            else if(val.Length == 3)
            {
                var test_string = val[0] + ":"  + val[1..];
                if(TimeOnly.TryParse(test_string, out test))
                {
                    result = test;
                }
            }
            else if(val.Length == 4)
            {
                var test_string = val[0..2] + ":"  + val[2..];
                if(TimeOnly.TryParse(test_string, out test))
                {
                    result = test;
                }
            }
            else
            {
                System.Console.WriteLine($"GetTimeField TryParse {path} key: {key} val:{val}");
            }      
        }
        else if
        (
            new_value.ValueKind != System.Text.Json.JsonValueKind.Undefined &&
            new_value.ValueKind != System.Text.Json.JsonValueKind.Null
        )
        {
            System.Console.WriteLine($"GetTimeField {path} key: {key}");
        }

        return result;
    }
    //case "datetime":
    public static DateTime?  GetDateTimeField(System.Text.Json.JsonElement value, string key, string path)
    {
        DateTime? result = null;

        if
        (
            value.TryGetProperty(key, out var new_value) &&
            new_value.ValueKind == System.Text.Json.JsonValueKind.String
        )
        {
            var val = new_value.GetString();
            if(string.IsNullOrWhiteSpace(val))
            {
                // do nothing
            }
            else if(DateTime.TryParse(val, out var test))
            {
                result = test;
            }   
            else
            {
                System.Console.WriteLine($"GetDateTimeField tryparse {path} key: {key} val:{val}");
            }
        }
        else if
        (
            new_value.ValueKind != System.Text.Json.JsonValueKind.Undefined &&
            new_value.ValueKind != System.Text.Json.JsonValueKind.Null
        )
        {
            System.Console.WriteLine($"GetDateTimeField {path} key: {key}");
        }

        return result;
    }


}