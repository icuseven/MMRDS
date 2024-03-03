
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.SqlTypes;
using System.Windows.Markup;

using mmria.common.metadata;

namespace mmria.case_version.v1;

public interface IConvertDictionary
{
    public void Convert(System.Text.Json.JsonElement p_value);
}

public sealed partial class mmria_case
{


    public static Dictionary<string, Metadata_Node> all_list_set = null;

    public static Dictionary<string,HashSet<string>> ErrorDictionary = new(StringComparer.OrdinalIgnoreCase);

    public delegate void add_error_delegate(string path, string error);

    public static event add_error_delegate add_error;
/*
    public static void add_error(string path, string error)
    {
        if(!ErrorDictionary.ContainsKey(path))
            ErrorDictionary.Add(path, new(StringComparer.OrdinalIgnoreCase));

        ErrorDictionary[path].Add(error);
    }


    public delegate string? try_correct_list_string_delegate(System.Text.Json.JsonElement value, string path);
    public delegate double? try_correct_list_double_delegate(System.Text.Json.JsonElement value, string path);
   
    public static event try_correct_list_string_delegate try_correct_list_string;
    public static event try_correct_list_double_delegate try_correct_list_double;
   
    public static string? try_correct_list_string_or_add_error(System.Text.Json.JsonElement value, string path, string error)
    {
        string? result = null;

        if
        (
            all_list_set == null ||
            !all_list_set.ContainsKey(path)
        )
        {
            if(!ErrorDictionary.ContainsKey(path))
                ErrorDictionary.Add(path, new(StringComparer.OrdinalIgnoreCase));

            ErrorDictionary[path].Add(error);

            goto return_label;
        }

return_label:

        if(try_correct_list_string != null)
        {
            result = try_correct_list_string(value, path);
        }

        return result;
    }

    public static double? try_correct_list_double_or_add_error(System.Text.Json.JsonElement value, string path, string error)
    {
        double? result = default;

        if
        (
            all_list_set == null ||
            !all_list_set.ContainsKey(path)
        )
        {
            if(!ErrorDictionary.ContainsKey(path))
                ErrorDictionary.Add(path, new(StringComparer.OrdinalIgnoreCase));

            ErrorDictionary[path].Add(error);

            goto return_label;
        }

return_label:


        if(try_correct_list_double != null)
        {
            result = try_correct_list_double(value, path);
        }

        return result;
    }
*/


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
            else if
            (
                new_value.ValueKind == System.Text.Json.JsonValueKind.Number
            )
            {
                result = new_value.GetDouble().ToString();
            }
            else
            {
                var error = $"GetStringListField path: {path} key{key} value: {new_value.GetString()}";
                
                
                if(add_error != null) add_error(path,error);
                System.Console.WriteLine(error);
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
                var error = $"GetNumberListField tryparse failed  path: {path} key:{key} val:{val}";
                if(add_error != null) add_error(path,error);
                //System.Console.WriteLine();
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
            //for(int i = 0; i < max_index; i++)
            foreach (System.Text.Json.JsonElement item in new_value.EnumerateArray())
            
            {
                //var item = new_value[i];

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
            int i = 0;
            var array_string = new_value.ToString();
            foreach (System.Text.Json.JsonElement item in new_value.EnumerateArray())
            
            {

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
                        var error = $"GetMultiSelectNumberListField TryParse Failed need a number  path: {path} array_incoming:{array_string} item_index: {i} val: {val}";
                        if(add_error != null) add_error(path, error);
                        //System.Console.WriteLine(error);
                    }
                }
                else 
                {
                    System.Console.WriteLine("GetMultiSelectNumberListField need a number");
                }
                i++;
            }


        }
        else if(new_value.ValueKind != System.Text.Json.JsonValueKind.Undefined)
        {
            switch(new_value.ValueKind)
            {

                case System.Text.Json.JsonValueKind.String:
                if(double.TryParse(new_value.GetString(), out var new_double_value))
                {

                    result = new List<double>()
                    {
                        new_double_value
                    };
            

                }
                else
                {
                     System.Console.WriteLine($"GetMultiSelectNumberListField  path: {path} array_incoming:{value.ToString()} ");
                }
                break;

                case System.Text.Json.JsonValueKind.Number:
                    result = new List<double>()
                    {
                        new_value.GetDouble()
                    };
            
                System.Console.WriteLine($"GetMultiSelectNumberListField  path: {path} array_incoming:{value.ToString()} ");
                break;

                case System.Text.Json.JsonValueKind.False:
                case System.Text.Json.JsonValueKind.True:
                System.Console.WriteLine($"GetMultiSelectNumberListField  path: {path} array_incoming:{value.ToString()} ");
                break;

                default:
                System.Console.WriteLine($"GetMultiSelectNumberListField  path: {path} array_incoming:{value.ToString()} ");
                break;
            }


            
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
            if(new_value.ValueKind == System.Text.Json.JsonValueKind.Null)
            {
                // do nothing
            }
            else if(new_value.ValueKind == System.Text.Json.JsonValueKind.String)
            {
                result = new_value.GetString();
            }
            else if(new_value.ValueKind == System.Text.Json.JsonValueKind.Number)
            {
                result = new_value.GetDouble().ToString();
            }
            else if
            (
                new_value.ValueKind == System.Text.Json.JsonValueKind.True ||
                new_value.ValueKind == System.Text.Json.JsonValueKind.False
            )
            {
                result = new_value.GetBoolean().ToString().ToLower();
            }
            else
            {
                System.Console.WriteLine($"GetHiddenField Not a string or number or boolean: {path} key: {key}");
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
                var error = $"GetNumberField {path} key: {key} val:{val}";
                if(add_error != null) add_error(path, error);
                //System.Console.WriteLine(error);
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
            var new_value_string = new_value.ToString();
            if(string.IsNullOrWhiteSpace(new_value_string))
            {
                // do nothing
            }
            else if(DateOnly.TryParse(new_value_string, out var date_only_test))
            {
                result = date_only_test;
            }  
            else if(DateTime.TryParse(new_value_string, out var date_time_test))
            {
                result = new DateOnly(date_time_test.Year, date_time_test.Month, date_time_test.Day);
            }  
            else
            {
                var error = $"GetDateField {path} key: {key} value:{new_value_string}";
                if(add_error != null) add_error(path, error);
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
        else
        {
           // System.Console.WriteLine($"GetDateField {path} key: {key}");
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
            if(string.IsNullOrWhiteSpace(val))
            {
                // do nothing
            }
            else if(TimeOnly.TryParse(val, out var test))
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
                var error = $"GetTimeField TryParse {path} key: {key} val:{val}";
                if(add_error != null) add_error(path,error);
                //System.Console.WriteLine(error);
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
                var error = $"GetDateTimeField tryparse {path} key: {key} val:{val}";
                if(add_error != null) add_error(path,error);
                //System.Console.WriteLine(error);
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

    public static bool?  GetBooleanField(System.Text.Json.JsonElement value, string key, string path)
    {
        bool? result = null;

        if
        (
            value.TryGetProperty(key, out var new_value)
        )
        {
            var val = new_value.GetString();
            switch(new_value.ValueKind)
            {
                case System.Text.Json.JsonValueKind.String:
                    
                    if(bool.TryParse(val, out var new_bool_value))
                        result = new_bool_value;
                    else
                        System.Console.WriteLine($"GetBooleanField tryparse {path} key: {key} val:{val}");

                break;
                case System.Text.Json.JsonValueKind.False:
                case System.Text.Json.JsonValueKind.True:
                    result = new_value.GetBoolean();
                break;
                default:
                    System.Console.WriteLine($"GetBooleanField tryparse {path} key: {key} val:{val}");
                break;
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