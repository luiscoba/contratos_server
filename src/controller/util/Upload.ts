import { Request, Response } from 'express';

class Upload {
  static oneDrive = async (req: Request, res: Response) => {
    /*
    var fs = require('fs');
    var request = require('request');
    var async = require('async');
    
    var client_id = "#####";
    var redirect_uri = "#####";
    var client_secret = "#####";
    var refresh_token = "#####";
    var file = "./sample.zip"; // Filename you want to upload.
    var onedrive_folder = 'SampleFolder'; // Folder on OneDrive
    var onedrive_filename = file; // If you want to change the filename on OneDrive, please set this.
    
    function resUpload(){
        request.post({
            url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            form: {
                client_id: client_id,
                redirect_uri: redirect_uri,
                client_secret: client_secret,
                grant_type: "refresh_token",
                refresh_token: refresh_token,
            },
        }, function(error, response, body) { // Here, it creates the session.
            request.post({
                url: 'https://graph.microsoft.com/v1.0/drive/root:/' + onedrive_folder + '/' + onedrive_file + ':/createUploadSession',
                headers: {
                    'Authorization': "Bearer " + JSON.parse(body).access_token,
                    'Content-Type': "application/json",
                },
                body: '{"item": {"@microsoft.graph.conflictBehavior": "rename", "name": "' + onedrive_filena '"}}',
            }, function(er, re, bo) {
                uploadFile(JSON.parse(bo).uploadUrl);
            });
        });
    }
    
    function uploadFile(uploadUrl) { // Here, it uploads the file by every chunk.
        async.eachSeries(getparams(), function(st, callback){
            setTimeout(function() {
                fs.readFile(file, function read(e, f) {
                    request.put({
                        url: uploadUrl,
                        headers: {
                            'Content-Length': st.clen,
                            'Content-Range': st.cr,
                        },
                        body: f.slice(st.bstart, st.bend + 1),
                    }, function(er, re, bo) {
                        console.log(bo);
                    });
                });
                callback();
            }, st.stime);
        });
    }
    
    function getparams(){
        var allsize = fs.statSync(file).size;
        var sep = allsize < (60 * 1024 * 1024) ? allsize : (60 * 1024 * 1024) - 1;
        var ar = [];
        for (var i = 0; i < allsize; i += sep) {
            var bstart = i;
            var bend = i + sep - 1 < allsize ? i + sep - 1 : allsize - 1;
            var cr = 'bytes ' + bstart + '-' + bend + '/' + allsize;
            var clen = bend != allsize - 1 ? sep : allsize - i;
            var stime = allsize < (60 * 1024 * 1024) ? 5000 : 10000;
            ar.push({
                bstart : bstart,
                bend : bend,
                cr : cr,
                clen : clen,
                stime: stime,
            });
        }
        return ar;
         */
  };
}
export default Upload;
