<%@ WebHandler Language="C#" Class="SaveSVG"  %>

using System;
using System.Web;

public class SaveSVG : IHttpHandler {

    public void ProcessRequest(HttpContext context) {

        string svgName = Guid.NewGuid().ToString("N");
        string svgData = Stepframe.Common.GetRequestVar("svgData");
        string svgFile = String.Empty;

        byte[] data = Convert.FromBase64String(svgData);
        string decodedString = System.Text.Encoding.UTF8.GetString(data);
        
        if (svgData != String.Empty) {

            svgFile = "/tmpFiles/" + svgName + ".svg";
 
            Stepframe.FileUtilities.WriteFile(context.Server.MapPath(svgFile), decodedString);
        }

        context.Response.ContentType = "text/plain";
        context.Response.Write(svgFile);
    }



    public bool IsReusable {
        get {
            return false;
        }
    }

}