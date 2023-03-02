
using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace mmria_pmss_client;

public interface IDatabaseService 
{ 
    Task<string> GetMetadataString(); 
    Task<mmria.common.metadata.app> GetMetadata(); 
}
public class DatabaseService : IDatabaseService
{
    private readonly HttpClient _httpClient;
    private readonly string _remoteServiceBaseUrl = "metadata/2016-06-12T13:49:24.759Z";
    public DatabaseService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<string> GetMetadataString()
    {
        return await _httpClient.GetStringAsync(_remoteServiceBaseUrl);
    }
    public async Task<mmria.common.metadata.app> GetMetadata()
    {
        return await _httpClient.GetFromJsonAsync<mmria.common.metadata.app>(_remoteServiceBaseUrl);
    }
}
