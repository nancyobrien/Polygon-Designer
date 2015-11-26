using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Amazon.S3;
using Amazon.S3.Model;
/// <summary>
/// Summary description for S3Upload
/// </summary>
public class S3Upload {


      //    <add key="AWSAccessKey" value="AKIAIVHDGYM3EEOMPUUQ"/>
      //<add key="AWSSecretKey" value="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"/>
      //<add key="AWSBucket" value="polygongraphics"/>
    //<add key="AWSBucketDev" value="polygongraphics-dev"/>

    private static string AccessKey {
        get {
            return  Stepframe.Common.GetAppSetting("AWSAccessKey");
        }
    }

    private static string SecretKey {
        get {
            return   Stepframe.Common.GetAppSetting("AWSSecretKey");
        }
    }

    private static string Bucket {
        get {
            string bucketName = "AWSBucket";
            if (IsDev) { bucketName = "AWSBucketDev"; }
            return Stepframe.Common.GetAppSetting(bucketName);
        }
    }
    private static string PublicBucket {
        get {
            return Stepframe.Common.GetAppSetting("AWSBucketPublicShare");
        }
    }

    private static Boolean IsDev {
        get {
            return !S3Upload.HostName.ToLower().Contains(Stepframe.Common.GetAppSetting("ProductionHost").ToLower());
        }
    }

    private static string HostName {
        get {
            return Stepframe.Common.context.Request.Url.Host;
        }
    }
    private S3Upload() {
        //
        // TODO: Add constructor logic here
        //
    }

    public static string UploadFile(byte[] image, string fileName) {
        return UploadFile(image, fileName, true);
    }
    public static string UploadFile(byte[] image, string fileName, Boolean usePublic) {
        string webPath = String.Empty;
        string bucket = S3Upload.Bucket;
        if (usePublic) { bucket = S3Upload.PublicBucket; }

        if (image.Length > 0) {// accept the file
            Amazon.S3.IAmazonS3 client = Amazon.AWSClientFactory.CreateAmazonS3Client(AccessKey, SecretKey, Amazon.RegionEndpoint.USWest2);

            using (client) {
                PutObjectRequest request = new PutObjectRequest();
                request.BucketName = bucket;
                request.CannedACL = S3CannedACL.PublicRead;
                request.Key = fileName;
                request.InputStream = new System.IO.MemoryStream(image); ;
                PutObjectResponse response = client.PutObject(request);
                webPath = "http://" + bucket + ".s3.amazonaws.com/" + fileName;
            }
        }
        return webPath;
    }
}



