"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var path_1 = require("path");
var os_1 = require("os");
var CERT_NAME = 'fullchain.pem';
var KEY_NAME = 'privkey.pem';
var CERT_DURATION = 89 * 24 * 60 * 60 * 1000;
function checkAndUpdate(keyPath, certPath, domain, email, checkDuration) {
    if (checkDuration === void 0) { checkDuration = CERT_DURATION; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var domainFolder = getDomainFolder(domain);
                    if (fs_1.existsSync(path_1.join(domainFolder, CERT_NAME))) {
                        if ((Date.now() - fs_1.statSync(path_1.join(domainFolder, CERT_NAME)).mtime.getTime()) < checkDuration) {
                            console.info('Up to date');
                            copyCerts(domainFolder, keyPath, certPath);
                            resolve();
                            return;
                        }
                    }
                    var p = child_process_1.spawn('certbot-auto', ['--standalone', 'certonly', '-d', domain, '--email', email, '--agree-tos', '-n'], { detached: false });
                    p.stderr.on('data', function (data) {
                        console.info(data.toString());
                    });
                    p.on('exit', function (code) {
                        console.info("exit " + code);
                        if (code !== 0 || !fs_1.existsSync(path_1.join(domainFolder, CERT_NAME)) || !fs_1.existsSync(path_1.join(domainFolder, KEY_NAME))) {
                            reject();
                        }
                        else {
                            copyCerts(domainFolder, keyPath, certPath);
                            resolve();
                        }
                    });
                })];
        });
    });
}
exports.checkAndUpdate = checkAndUpdate;
function copyCerts(domainFolder, keyPath, certPath) {
    fs_1.copyFileSync(path_1.join(domainFolder, KEY_NAME), keyPath);
    fs_1.copyFileSync(path_1.join(domainFolder, CERT_NAME), certPath);
    fs_1.chmodSync(keyPath, 256 | 128);
    fs_1.chmodSync(certPath, 256 | 128);
    var _a = os_1.userInfo(), uid = _a.uid, gid = _a.gid;
    fs_1.chownSync(keyPath, uid, gid);
    fs_1.chownSync(keyPath, uid, gid);
}
function getDomainFolder(domain) {
    return "/etc/letsencrypt/live/" + domain + "/";
}
//# sourceMappingURL=index.js.map