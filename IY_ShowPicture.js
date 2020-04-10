//============================================================================
// IY_ShowPicture.js
//============================================================================

/*:
* @plugindesc Makes show pictures for VN easier
* @author Illya_Sora
*
* @param Common Picture Name
* @desc Uniform name of the pictures
*
* @param Sprites
* @type struct<ASprite>[]
*
* @param Variable ID
* @desc The ID of the variable you will use for determing the face image
* @default 5
* Default: 5
* @type number
* 
* @help
* ----------------------------------------------------------------------------
* Terms of use
* ----------------------------------------------------------------------------
* Don't remove the header or claim that you wrote this plugin.
* Credit Illya_Sora if using this plugin in your project.
* Free for commercial or non-commercial use.
* ----------------------------------------------------------------------------
* Version 1.0
* ----------------------------------------------------------------------------
*
* ----------------------------------------------------------------------------
* Plugin Command
* ----------------------------------------------------------------------------
* showPic X @x @y - Shows picture with the corresponding name (X) at the position 
* @x (ID Varibale 1) and @y (ID Variable 2)
* ----------------------------------------------------------------------------
*
* ----------------------------------------------------------------------------
* Version history
* ----------------------------------------------------------------------------
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
IY.ShowPic.Parameters = PluginManager.parameters("IY_ShowPicture");

IY.ShowPic.uniformName = String(IY.ShowPic.Parameters["Common Picture Name"]);
IY.ShowPic.sprites = IY.ShowPic.Parameters["Sprites"];
IY.ShowPic.variableID = Number(IY.ShowPic.Parameters["Variable ID"]);

(function() {

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        if(command.toLowerCase() === 'showpic') {
            var a = args[0];
            var x = $gameVariables.value(args[1]);
            var y = $gameVariables.value(args[2]);
            var filename = getLeaderFilename();
            
            $gameScreen.showPicture(1, `${IY.ShowPic.uniformName} ${filename}0${a}`, 0, x, y, 100, 100, 255, 0);
            $gameVariables.setValue(IY.ShowPic.variableID, args[0]-1);
            console.log(IY.ShowPic.variableID);
            $gameMap.event(9)
        } else if(command.toLowerCase() === 'erasepic') {
            $gameScreen.erasePicture(args[0]);
        } else if(command.toLowerCase() === 'pixicommand') {
            //var abc = piccommand();
            //abc();
            SceneManager.push(Scene_Save);
            $gameVariables.onChange()
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

    function piccommand() {
        var x = TouchInput._x;
        var y = TouchInput._y;
        return function() {
            $gameScreen.showPicture(1, 'Slime', 1, x, y, 100, 100, 255, 0);
            $gameScreen.rotatePicture(1, 5);
        }
    }    
})();