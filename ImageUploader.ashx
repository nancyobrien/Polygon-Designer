<%@ WebHandler Language="C#" Class="ImageUploader" %>

using System;
using System.Web;

public class ImageUploader : IHttpHandler {

    public void ProcessRequest(HttpContext context) {
        //string projectID = Stepframe.Common.GetRequestVar("projectID");
        string fileLink = String.Empty;

        
        //Yeah this doesn't work
        if (context.Request.InputStream.Length > 0) {
            Boolean generateThumbnail = (Stepframe.Common.GetRequestVar("thumb") != String.Empty);
            Boolean publicViewLink = (Stepframe.Common.GetRequestVar("public") != String.Empty);
            HttpFileCollection files = context.Request.Files;
            foreach (string key in files) {
                HttpPostedFile file = files[key];
          
                string imageName = Guid.NewGuid().ToString("N") + ".png";
               
                file.SaveAs(context.Server.MapPath(FileIO.TempPath) + imageName);

                fileLink = context.Request.Url.Host.ToString() + FileIO.TempPath.Replace("~", String.Empty).Replace("\\", "/") + imageName;
            }
        }

 
    


        context.Response.ContentType = "text/plain";
        context.Response.Write(fileLink);
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}