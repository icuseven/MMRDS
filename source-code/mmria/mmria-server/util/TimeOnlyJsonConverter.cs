using System;
using Akka.Util;

namespace mmria.server.utils;
public class TimeOnlyJsonConverter : Newtonsoft.Json.JsonConverter<System.Nullable<TimeOnly>>
{
    const string TimeFormat = "HH:mm:ss.FFFFFFF";
    //const string TimeFormat = "HH:mm";

    public override TimeOnly? ReadJson(Newtonsoft.Json.JsonReader reader, Type objectType, TimeOnly? existingValue, bool hasExistingValue, Newtonsoft.Json.JsonSerializer serializer)
    {
        TimeOnly? result = null;
        //return TimeOnly.ParseExact((string)reader.Value, TimeFormat, System.Globalization.CultureInfo.InvariantCulture);
        if (TimeOnly.TryParse((string)reader.Value, out var parsed))
        {   
            result = parsed;
        }

        return result;
    }

    public override void WriteJson(Newtonsoft.Json.JsonWriter writer, TimeOnly? value, Newtonsoft.Json.JsonSerializer serializer)
    {
        if(value.HasValue)
        writer.WriteValue(value.Value.ToString(TimeFormat, System.Globalization.CultureInfo.InvariantCulture));
    }
}