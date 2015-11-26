<%@ WebHandler Language="C#" Class="ImageUploader" %>

using System;
using System.Web;
using System.IO;

public class ImageUploader : IHttpHandler {

    public void ProcessRequest(HttpContext context) {
        string fileLink = String.Empty;

        if (context.Request.InputStream.Length > 0) {
            Boolean generateThumbnail = (Stepframe.Common.GetRequestVar("thumb") != String.Empty);
            Boolean publicViewLink = (Stepframe.Common.GetRequestVar("public") != String.Empty);
            
            string imageName = Guid.NewGuid().ToString("N") + ".png";

            string fileNameWitPath = context.Server.MapPath(FileIO.TempPath) + imageName;

            byte[] buffer = new byte[context.Request.InputStream.Length];
            context.Request.InputStream.Read(buffer, 0, buffer.Length);
            string data = System.Text.Encoding.Default.GetString(buffer);

            byte[] image = Convert.FromBase64String(data);

            File.WriteAllBytes(fileNameWitPath, image);
            fileLink = S3Upload.UploadFile(image, imageName);
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