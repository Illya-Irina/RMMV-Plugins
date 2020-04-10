//============================================================================
// IY_ShowPictureNew.js
//============================================================================

//============================================================================
//Don't forget to use /** for comment beginning!
/*:
 * @plugindesc Makes show pictures for VN easier
 * @author Illya_Sora
 *
 * @param Common Picture Name
 * @desc Uniform name of the pictures
 * 
 * @param Zero In PicNumber
 * @type boolean
 * @on YES
 * @off NO
 * @desc Use a zero before the PicNumber?
 * YES - true   NO - false
 * @default true
 * 
 * @param Picture Ending
 * @type combo
 * @option .png
 * @option .jpg
 * @option .jpeg
 * @option .tnf
 * @desc Determines the file ending of the pictures. Please only one for all!
 * @default .png
 * Default: .png
 *
 * @param Face Sprites
 * @type struct<ASprite>[]
 * @desc Set the Facesprites of ANY actor. Need the actor's class and the according face sprite file name.
 * 
 * @param Variable ID
 * @desc The ID of the variable you will use for determing the face image
 * @default 5
 * Default: 5
 * @type number
 * 
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * This plugin enables you to easily show pictures on the screen of the leader.
 * It eanbles you to simply use the same plugin-command for every actor,
 * without the need to make program huge if-else-statements.
 * ============================================================================
 * Terms of use
 * ============================================================================
 * Don't remove the header or claim that you wrote this plugin.
 * Credit Illya_Sora if using this plugin in your project.
 * Free for commercial or non-commercial use.
 * ============================================================================
 * Version 1.0
 * ============================================================================
 *
 * ============================================================================
 * Plugin Command
 * ============================================================================
 * 
 * Show Pictures:
 * 
 * showPic <PictureNumber> <VariableID 1> <VariableID 2>        or use
 * 
 * showPic Pic: <x>, Var1: <VariableID>, Var2: <VariableID>
 * 
 * 
 * Erase Pictures: (currenly only working properly combined with above command)
 * 
 * erasePic 
 * (No parameters. Deletes right picture automatically!)
 * 
 * 
 * 
 * Example of naming Pictures: 
 * Name of the Picture: "fantasy-heroine-girl SHaman01.png"
 * 
 * "fanatsy-heroine-girl is the Common Name
 * "Shaman" is the class of the leader
 * "01" is the Number of the Picture
 * ".png" is the ending
 * ============================================================================
 *
 * ============================================================================
 * Version history
 * ============================================================================
 * v1.0 - Release
*/

/*~struct~ASprite:
* @param Class
* @type Text
*
* @param Filename
* @type Text
*/

var IY = IY || {};
IY.ShowPic = {};
IY.ShowPic.Parameters = PluginManager.parameters("IY_ShowPictureNew");

IY.ShowPic.uniformName = String(IY.ShowPic.Parameters["Common Picture Name"]);
IY.ShowPic.sprites = IY.ShowPic.Parameters["Face Sprites"];
IY.ShowPic.variableID = Number(IY.ShowPic.Parameters["Variable ID"]);
IY.ShowPic.zeroInPicNumber = Boolean(IY.ShowPic.Parameters["Zero In PicNumber"]);
IY.ShowPic.picEnding = String(IY.ShowPic.Parameters["Picture Ending"]);

IY.ShowPic.index = 1;

(function() {

    var mapID, eventID, _number;
    
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        if(command.toLowerCase() === 'showlea') {
            setPictureIndex(args);
            var filename = getLeaderFilename();
            var text = argsToString(args);
            validate(text, filename);
        }
        if(command.toLowerCase() === 'showpic') {
            setPictureIndex(args);
            var filename = getLeaderFilename();
            var text = argsToString(args);
            validate(text, filename);
        }
        if(command.toLowerCase() === 'erasepic') {
            $gameScreen.erasePicture(_number);
        }
        if(command.toLowerCase() === 'setnumber') {
            setPictureIndex(args);
        }

    }

    function argsToString(args) {
        var text = '';
        for(var i = 0; i < args.length; ++i) {
            text += args[i] + ' ';
        }
        return text.trim();
    }
    
     function validate(text, filename) {
        var reg = _reg();
        
        if(reg.re1 !== null || reg.re2 !== null) {
            if(reg.re1.test(text)) {
                reg.re1.lastIndex = 0;
                var _array = reg.re1.exec(text);
                var v = setVariables(_array[2], _array[3]);
                showPic(_array, v.v1, v.v2, filename);
            } else if(reg.re2.test(text)) {
                reg.re2.lastIndex = 0;
                //var _array = re_2.exec(text);
                var _array = reg.re2.exec(text);
                var v = setVariables(_array[2], _array[3]);
                showPic(_array, v.v1, v.v2, filename);
            } else {
                alert('IY_ShowPictureNew Error! Your plugin command doesn\'t match any pattern. Pleaser restart and inout something different');
                return;
            }
        }
    }

    function setVariables(index_1, index_2) {
        var var1 = $gameVariables.value(index_1);
        var var2 = $gameVariables.value(index_2);
        return {
            v1: var1,
            v2: var2
        }
    }

    function getLeaderFilename() {
        var leaderID = $gameParty.leader().actorId();
        var actorClass = $gameActors.actor(leaderID).currentClass().name;

        var sp = JSON.parse(IY.ShowPic.sprites);

        for(var i = 0; i < sp.length; i++) {
            var _aClass = JSON.parse(sp[i]);
            if(actorClass === _aClass["Class"]) {
                return _aClass["Filename"];
            }
        }
    }

    function showPic(array, var1, var2, filename) {
        $gameVariables.setValue(IY.ShowPic.variableID, array[1]-1);
        var picNum = parseInt(array[1]);
        if(IY.ShowPic.zeroInPicNumber) {
            if(picNum >= 10) {
                $gameScreen.showPicture(_number, `${IY.ShowPic.uniformName} ${filename}${parseInt(array[1])}`, 0, var1, var2, 100, 100, 255, 0);
            } else {
                $gameScreen.showPicture(_number, `${IY.ShowPic.uniformName} ${filename}0${picNum}`, 0, var1, var2, 100, 100, 255, 0);
            }
            
        } else {
            $gameScreen.showPicture(_number, `${IY.ShowPic.uniformName} ${filename}${parseInt(array[1])}`, 0, var1, var2, 100, 100, 255, 0);
        }
        
    }

    function setPictureIndex(args) {
        var text = argsToString(args);
        var re = _reg().re3
        if(text.match(re)) {
            re.lastIndex = 0;
            _number = re.exec(text)[1];
        } else {
            _number = 1;
        }
    }

    function piccommand() {
        var x = TouchInput._x;
        var y = TouchInput._y;
        return function() {
            $gameScreen.showPicture(1, 'Slime', 1, x, y, 100, 100, 255, 0);
            $gameScreen.rotatePicture(1, 5);
        }
    }    

    var _reg = function() {
        var re_1 = /\s*pic\s*:\s*(\d+)\s*,\s*Var1\s*:\s*(\d+)\s*,\s*Var2\s*:\s*(\d+)/ig;   //Show Leader #1
        var re_2 = /\s*(\d+)\s+(\d+)\s+(\d+)/ig;                                           //Show Leader #2
        var re_3 = /\s*(\d+(?!\s+))/ig;                                                          //Set Number of Pic

        return {
            re1: re_1,
            re2: re_2,
            re3: re_3
        }
    }
})();