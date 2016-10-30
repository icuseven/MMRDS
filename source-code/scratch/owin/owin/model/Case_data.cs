using System;

namespace owin.data
{
	public class Case_data : System.Dynamic.DynamicObject
	{
		System.Collections.Generic.Dictionary<string, object> properties = new System.Collections.Generic.Dictionary<string, object>();

		public override bool TryGetMember(System.Dynamic.GetMemberBinder binder, out object result)
		{
			if (properties.ContainsKey(binder.Name))
			{
				result = properties[binder.Name];
				return true;
			}
			else
			{
				result = "Invalid Property!";
				return false;
			}
		}

		public override bool TrySetMember(System.Dynamic.SetMemberBinder binder, object value)
		{
			properties[binder.Name] = value;
			return true;
		}

		public override bool TryInvokeMember(System.Dynamic.InvokeMemberBinder binder, object[] args, out object result)
		{
			dynamic method = properties[binder.Name];
			result = method(args[0].ToString(), args[1].ToString());
			return true;
		}
	}
}

