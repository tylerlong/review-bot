const rp = require('request-promise')

const lookup = async (id) => {
  const body = await rp(`http://itunes.apple.com/${id}`)
  const json = JSON.parse(body)
  if (json.resultCount < 1) {
    return null
  }
  return json.results[0]
}

module.exports = { lookup }

/*
{
  "resultCount": 1,
  "results": [
    {
      "ipadScreenshotUrls": [
        "http://is5.mzstatic.com/image/thumb/Purple111/v4/df/fd/45/dffd45eb-436d-99b4-bd4d-b26edb0bd33e/source/552x414bb.jpg",
        "http://is4.mzstatic.com/image/thumb/Purple111/v4/3c/0a/ab/3c0aab17-d070-9f9d-f067-6cfbeb625be2/source/552x414bb.jpg"
      ],
      "appletvScreenshotUrls": [

      ],
      "artworkUrl60": "http://is3.mzstatic.com/image/thumb/Purple128/v4/3f/cc/1e/3fcc1ee9-ff0c-1d31-64f9-0a6c71d2ad7f/source/60x60bb.jpg",
      "artworkUrl512": "http://is3.mzstatic.com/image/thumb/Purple128/v4/3f/cc/1e/3fcc1ee9-ff0c-1d31-64f9-0a6c71d2ad7f/source/512x512bb.jpg",
      "artworkUrl100": "http://is3.mzstatic.com/image/thumb/Purple128/v4/3f/cc/1e/3fcc1ee9-ff0c-1d31-64f9-0a6c71d2ad7f/source/100x100bb.jpg",
      "artistViewUrl": "https://itunes.apple.com/us/developer/at-t-services-inc/id290854684?uo=4",
      "isGameCenterEnabled": false,
      "kind": "software",
      "features": [
        "iosUniversal"
      ],
      "supportedDevices": [
        "iPad2Wifi-iPad2Wifi",
        "iPad23G-iPad23G",
        "iPhone4S-iPhone4S",
        "iPadThirdGen-iPadThirdGen",
        "iPadThirdGen4G-iPadThirdGen4G",
        "iPhone5-iPhone5",
        "iPodTouchFifthGen-iPodTouchFifthGen",
        "iPadFourthGen-iPadFourthGen",
        "iPadFourthGen4G-iPadFourthGen4G",
        "iPadMini-iPadMini",
        "iPadMini4G-iPadMini4G",
        "iPhone5c-iPhone5c",
        "iPhone5s-iPhone5s",
        "iPadAir-iPadAir",
        "iPadAirCellular-iPadAirCellular",
        "iPadMiniRetina-iPadMiniRetina",
        "iPadMiniRetinaCellular-iPadMiniRetinaCellular",
        "iPhone6-iPhone6",
        "iPhone6Plus-iPhone6Plus",
        "iPadAir2-iPadAir2",
        "iPadAir2Cellular-iPadAir2Cellular",
        "iPadMini3-iPadMini3",
        "iPadMini3Cellular-iPadMini3Cellular",
        "iPodTouchSixthGen-iPodTouchSixthGen",
        "iPhone6s-iPhone6s",
        "iPhone6sPlus-iPhone6sPlus",
        "iPadMini4-iPadMini4",
        "iPadMini4Cellular-iPadMini4Cellular",
        "iPadPro-iPadPro",
        "iPadProCellular-iPadProCellular",
        "iPadPro97-iPadPro97",
        "iPadPro97Cellular-iPadPro97Cellular",
        "iPhoneSE-iPhoneSE",
        "iPhone7-iPhone7",
        "iPhone7Plus-iPhone7Plus",
        "iPad611-iPad611",
        "iPad612-iPad612",
        "iPad71-iPad71",
        "iPad72-iPad72",
        "iPad73-iPad73",
        "iPad74-iPad74"
      ],
      "screenshotUrls": [
        "http://is1.mzstatic.com/image/thumb/Purple111/v4/1b/cf/b8/1bcfb8de-ea0d-e1fe-f713-930b5d18b266/source/392x696bb.jpg",
        "http://is1.mzstatic.com/image/thumb/Purple111/v4/c7/e9/15/c7e91591-386b-b625-f799-c2cb758c7ace/source/392x696bb.jpg",
        "http://is1.mzstatic.com/image/thumb/Purple122/v4/61/da/60/61da6089-d2d9-d4b5-f034-2dea0db9151a/source/392x696bb.jpg"
      ],
      "advisories": [

      ],
      "trackCensoredName": "RingCentral Office@Hand from AT&T",
      "languageCodesISO2A": [
        "EN"
      ],
      "fileSizeBytes": "109015040",
      "sellerUrl": "http://www.att.com/office@hand",
      "contentAdvisoryRating": "4+",
      "trackViewUrl": "https://itunes.apple.com/us/app/ringcentral-office-hand-from-at-t/id398089358?mt=8&uo=4",
      "trackContentRating": "4+",
      "formattedPrice": "Free",
      "minimumOsVersion": "9.0",
      "currency": "USD",
      "wrapperType": "software",
      "version": "9.2.1.3.10",
      "artistId": 290854684,
      "artistName": "AT&T Services, Inc.",
      "genres": [
        "Business",
        "Productivity"
      ],
      "price": 0,
      "description": "Connect employees with one cloud based phone and fax system, allowing them to work virtually anywhere, and simplify how customers reach your business.\n\nUse RingCentral Office@Hand from AT&T to:\n\n• Enable voice, fax and SMS on a single number\n• Set-up and manage greetings and call handling preferences, right from your iPhone \n• Direct calls to any phone, mobile, office or home number \n• Get visual voicemail for your business calls, separate from your personal messages\n• View and forward faxes\n• Order desktop IP phones*, preconfigured and Plug & Ring® ready for your office workers\n• Display your business phone number as your Caller ID when making US and International calls\n• Transfer live calls between mobile and desk phones\n• Make and receive calls over WiFi\n• Make HD Video Conference calls with Office@Hand Meetings for Enterprise Edition; share your screen and files with others\n\nWith no setup fees or complex system hardware required, plus instant activation, RingCentral Office@Hand from AT&T is available in two Editions - Standard, Premium and Enterprise - and is billed conveniently to your AT&T wireless bill.\n\nActivate, set up, and manage a complete mobile business phone system right from your iPhone in minutes. Start handling your customers’ calls professionally now with features such as **: \n• Auto-receptionist\n• Business SMS\n• Toll Free, Vanity, Local voice and fax numbers for your business and employees \n• Call forwarding, customizable by time of day\n• Multiple department and user extensions\n• Voice and fax email notifications\n• Virtually unlimited local/long distance voice calling and faxes \n• Send and receive faxes, by accessing photos, email attachments, and cloud storage.\n• Dial-by-name directory\n• Music on hold\n• Inbound and outbound Caller ID\n• Internal Caller ID\n• Auto call recording***\n• Conference calling for virtually unlimited audio conferencing****\n• Start conferences with just one tap and easily invite attendees using email or Business SMS****\n• View and forward faxes\n• CloudFax™ allows you to attach local files, as well as cloud files, from popular services, including Box and DropBox applications on your PC\n• Call screening and logs\n• Salesforce.com® integration*** to click-to-dial contacts, log notes, match records\n• Desktop IP phones*** for office workers and softphones for MAC and PC users\n• Call Park and Unpark\n• Shared Lines\n• HD Video Conferencing and Collaboration with Office@Hand Meetings*****\n• Share your screen and files with anyone, anytime with Office@Hand Meetings*****\n\nVisit att.com/officeathand to learn how RingCentral Office@Hand from AT&T can improve customer satisfaction, help manage costs and enhance your professional image. \n\n\n*Purchased separately.\n**Users of some phones will require online access to usesome features.\n***Included with Premium and Enterprise Edition user licenses only\n****6-hour limit per conference call\n*****Included with Enterprise Edition user licenses only",
      "trackId": 398089358,
      "trackName": "RingCentral Office@Hand from AT&T",
      "bundleId": "com.att.ringcentral.vr2",
      "isVppDeviceBasedLicensingEnabled": true,
      "primaryGenreName": "Business",
      "releaseDate": "2011-02-01T13:32:42Z",
      "releaseNotes": "What's new in 9.2\nBug Fixes.",
      "primaryGenreId": 6000,
      "sellerName": "AT&T Services, Inc.",
      "genreIds": [
        "6000",
        "6007"
      ],
      "currentVersionReleaseDate": "2017-08-31T21:13:41Z",
      "averageUserRating": 3.5,
      "userRatingCount": 433
    }
  ]
}
*/
