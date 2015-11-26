<%@ WebHandler Language="C#" Class="S3Policy" %>

using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Security.Cryptography;

using System.Text;
using System.IO;

using Amazon;
using Amazon.S3;
using Amazon.S3.Model;

public class S3Policy : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
              context.Response.ContentType = "application/json";


        string publicKey = System.Configuration.ConfigurationManager.AppSettings["AWSAccessKey"];
        string secretKey = System.Configuration.ConfigurationManager.AppSettings["AWSSecretKey"];
        string bucketName = System.Configuration.ConfigurationManager.AppSettings["AWSBucket"];

        StreamReader stream = new StreamReader(context.Request.InputStream);
        string policy = stream.ReadToEnd();
        SignaturePolicy pol = new SignaturePolicy(policy);

        if (pol.isPolicyValid) {
            context.Response.Write("{\"policy\":\"" + pol.EncryptedPolicy + "\",\"signature\":\"" + pol.Signature + "\"}");
        } else {
            context.Response.Write("Invalid Policy Request");
        }

    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}


