using System.Collections.Generic;
using System.Web.Http;
using System.Linq;

namespace owin
{
	public class current_editController: ApiController 
	{ 
		public static System.Collections.Generic.Dictionary<string, Current_Edit> current_edit = null;

		static current_editController()
		{
			current_edit = new System.Collections.Generic.Dictionary<string, Current_Edit>(System.StringComparer.OrdinalIgnoreCase);

			Current_Edit current = new Current_Edit();
			current.id = "";
			current.edit_type = "json";

			current_edit.Add ("metadata", current);
		}

		// GET api/values 
		public IEnumerable<Current_Edit>  Get() 
		{ 
			return current_edit.Select(kvp => kvp.Value).AsEnumerable(); 
		} 

		// GET api/values/5 
		public string Get(int id) 
		{ 
			return "value"; 
		} 

		// POST api/values 
		public void Post([FromBody]string metadata) 
		{ 
			string hash = GetHash (metadata);
			if (current_edit ["metadata"].id != hash) 
			{
				Current_Edit current = new Current_Edit();
				current.id = hash;
				current.metadata = metadata;
				current.edit_type = "json";

				current_edit ["metadata"] = current;
			}
		} 

		// PUT api/values/5 
		public void Put(string id, [FromBody]string value) 
		{ 
		} 

		// DELETE api/values/5 
		public void Delete(int id) 
		{ 
		} 

		public  string GetHash(string metadata)
		{
			string result;
			byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(metadata);
			System.IO.MemoryStream stream = new System.IO.MemoryStream(byteArray);

			System.Text.StringBuilder sb = new System.Text.StringBuilder();
			System.Security.Cryptography.MD5 md5Hasher = System.Security.Cryptography.MD5.Create();

			foreach (byte b in md5Hasher.ComputeHash(stream))
					sb.Append(b.ToString("X2").ToLowerInvariant());

			result = sb.ToString();

			return result;
		}
	} 
}

