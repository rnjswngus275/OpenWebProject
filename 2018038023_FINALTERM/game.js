enchant();
window.onload = function() {
  var game = new Game(320, 320);
  game.fps = 48;
  game.preload('img/map1.png', 'img/chara0.png', 'img/chara5.png', 'img/chara6.png', 'img/chara7.png');
  game.keybind (32, 'a');
  game.onload = function() {
   
// 함수지정

   var textBox = new Sprite(300, 100);
   textBox.backgroundColor = 'black';
   textBox.moveTo (10, 10);
   textBox.opacity = 0;

   var textLabel = new Label('');
   textLabel.moveTo (20, 20);
   textLabel.color = 'white';
   
   var say = function (someth) {
     textBox.opacity = 0.7;
     textLabel.moveTo (veiwX + 20, veiwY + 20);
     textBox.moveTo (veiwX + 10, veiwY + 10);
     textLabel.text = someth;
   };		

   var sayend = function () {
     textBox.opacity = 0;
     textLabel.text = '';
     Yes.text = '';
     No.text = '';
   };

   var status = function () {
     say ('== ' + player_name + ' ==' +
     '<br> 레벨 : ' + player_lv +
     '<br>  HP : ' + player_hp + ' / ' + player_maxhp +
     '          MP : ' + player_mp + ' / ' + player_maxmp +
     '<br> 공격력 : ' + player_attack +
     '             경험치 : ' + player_exp + ' / ' + player_nextexp +
     '<br> 골드 : ' + player_money + 'G');
   };  

   var Yes = new Label ('');

   var No = new Label ('');
   
   var yesorno = function () {
    Yes.text = '◀ 예';
    Yes.color = 'white';
    Yes.moveTo (veiwX + 120, veiwY + 90);
    No.text = '아니오 ▶';
    No.color = 'white';
    No.moveTo (veiwX + 220, veiwY + 90);
   };

   Yes.on ('touchstart', function() {
     if (shoping) {
        player_money -= item[itemselect].price;
        inventory[itemnum] = itemselect;
        itemnum += 1;
        itemtxtre();
        shoping = false;
        sayend();
     } else if (selling) {
        player_money += item[itemselect].price;
        inventory.splice (itemslot, 1);
        inventory.push (0);
        itemnum -= 1;
        itemtxtre();
        selling = false;
        sayend();
     } else if (useitem) {
        if (player_hp + 10 < player_maxhp) {
          player_hp += 10;
          inventory.splice (itemslot, 1);
          inventory.push (0);
          itemnum -= 1;
          itemtxtre();
          sayend();
          useitem = false;
        } else if (player_hp + 10 >= player_maxhp) {
          player_hp = player_maxhp;
          inventory.splice (itemslot, 1);
         inventory.push (0);
          itemnum -= 1;
          itemtxtre();
          sayend();              
          useitem = false; 
        }
      }
   });

   No.on ('touchstart', function() {
     if (shoping) {
      shoping = false;
      sayend();
     } else if (selling) {
      selling = false;
      sayend();
     } else if (useitem) {
      sayend();
      useitem = false;
     }
   });

   var ttt = new Label("");
 
   var useitem = false;


//맵설정

    var map = new Map(16, 16);
    map.image = game.assets['img/map1.png'];
    map.loadData(map01_layer0, map01_layer1);
    map.collisionData = map01_coll;     
    map.on ('enterframe', function() {
      if (player.x == 264 && player.y == 320 && player.direction == 3) {
      say ('도구점 입니다. <br>※ 단발머리는 판매를 담당합니다. <br>※ 포니테일은 매입을 담당합니다.'); 
      }
      if (player.x == 280 && player.y == 176 && player.direction == 3) {
        npc1fx();
       }
      if (player.x == 296 && player.y == 176 && player.direction == 3) {
        npc2fx();
      }
      if (player.x == 328 && player.y == 160) {
        player.x = 56;
        player.y = 64;
        stage.addChild (npc3);
      }
      if (player.x == 56 && player.y == 48) {
        player.x = 328; 
        player.y = 144;
      }
   });

    var formap = new Map(16, 16);
    formap.image = game.assets['img/map1.png'];
    formap.loadData(map01_layer2);
    formap.opacity = 0.5;

    var player = new Sprite (32, 32);
    player.image = game.assets['img/chara5.png'];
    player.moveTo (16 * 7 - 8, 16 * 10 - 16);
    player.direction = 0;
    player.walk = 1;
    player.isMoving = false;
    player.on('enterframe', function() {
      player.frame = player.direction * 9 + player.walk;      
      if (!player.isMoving) {
        player.vx = player.vy = 0;
        if (game.input.left) {
          player.direction = 1;
          player.vx = -4;
        } else if (game.input.right) {
         player.direction = 2;
         player.vx = 4;
        } else if (game.input.up) {
         player.direction = 3;
         player.vy = -4;
        } else if (game.input.down) {
         player.direction = 0;
         player.vy = 4;
        }
        if (player.vx != 0 || player.vy != 0 ) {
          player.toX = player.x + (player.vx != 0 ? player.vx / 4 * 16 : 0) + 16;
          player.toY = player.y + (player.vy != 0 ? player.vy / 4 * 16 : 0) + 16;
          if (0 <= player.toX && player.toX < map.width && 0 <= player.toY && player.toY < map.height && !map.hitTest(player.toX, player.toY)) {
            player.isMoving = true;
            sayend();
          }
        }
      } else {
       player.moveBy(player.vx, player.vy);
       player.walk++;
       player.walk %= 3;
       if ((player.vx && (player.x-8) % 16 === 0) || (player.vy && player.y % 16 === 0)) {
         player.isMoving = false;
         player.walk = 1;
       }
     }

     if (player.x <= 160) {
       veiwX = 0;
     } else if (player.x > 160 && player.x <= map.width - 176) {
       veiwX = player.x - 152;
     } else if (player.x > map.width - 176) {
       veiwX = map.width - 320;
     }

     if (player.y <= 160) {
       veiwY = 0;
     } else if (player.y >160 && player.y <= map.height - 176) {
       veiwY = player.y - 152;
     } else if (player.y > map.height -176) {
       veiwY = map.height - 320; 
     }

     if (player_exp >= player_nextexp) {
       say (player_name + '은 레벨업 했다!');
       player_nextexp *= 2;
       player_maxhp *= 2;
       player_maxmp *= 2;
       player_attack *= 2;
       player_lv +=1;
       player_hp = player_maxhp;
       player_mp = player_maxmp;
     }

     if (useitem) {
       if (itemselect == 1) {
         say ('약초를 사용하시겠습니까?');
         yesorno();
         if (game.input.left) {
           if (player_hp + 10 < player_maxhp) {
             player_hp += 10;
             inventory.splice (itemslot, 1);
             inventory.push (0);
             itemnum -= 1;
             itemtxtre();
             sayend();
             useitem = false;
            } else if (player_hp + 10 >= player_maxhp) {
             player_hp = player_maxhp;
             inventory.splice (itemslot, 1);
             inventory.push (0);
             itemnum -= 1;
             itemtxtre();
             sayend();              
             useitem = false;
            }
          } else if (game.input.right) {
            sayend();
            useitem = false;
          } else if (game.input.up) {
            sayend();
            useitem = false;
          } else if (game.input.down) {
            sayend();
            useitem = false;
          }
        } else {
         say ('이 아이템은 필드에서 사용할수 없습니다.');
         useitem = false;
        }
     }
 
     if (inventory.indexOf(2) == -1) {
       player.image = game.assets ['img/chara5.png'];
      } else {
       player.image = game.assets ['img/chara7.png'];
      }

     ttt.text = player.x + "/" + player.y;
      
   });

//메뉴씬
   
   var Menu = new Scene(320, 320);
   var menucur = new Sprite(140, 20);
   menucur.backgroundColor = 'black';
   menucur.moveTo (80, 100);

   var menustat = new Label ("STATUS");
   menustat.color = 'white';
   menustat.textAlign = 'center';
   menustat.font = 'bold 20px 돋움';
   menustat.y = 100;

   var menuiven = new Label ("INVENTORY");
   menuiven.color = 'white';
   menuiven.textAlign = 'center';
   menuiven.font = 'bold 20px 돋움';
   menuiven.y = 140;

   var menufile = new Label ("FILE");
   menufile.color = 'white';
   menufile.textAlign = 'center';
   menufile.font = 'bold 20px 돋움';
   menufile.y = 180;

   var menuback = new Label ("BACK");
   menuback.color = 'white';
   menuback.textAlign = 'center';
   menuback.font = 'bold 20px 돋움';
   menuback.y = 220;

   Menu.on ('enterframe', function() {
     if (menucur.y < 220 && game.input.down) {
       menucur.y += 40;
       game.input.down = false;
     } else if (menucur.y > 100 && game.input.up) {
       menucur.y -= 40;
       game.input.up = false;
     }
    });
     

   Menu.on ('abuttondown', function() {
     if (menucur.y == 100) {
       game.popScene (Menu);
       status();
     } else if (menucur.y == 140) {
       game.replaceScene (Inven);
       useitem = true;
     } else if (menucur.y == 180) {
       game.replaceScene (File);
     } else {
       game.popScene (Menu);
     }
   });

   menustat.on ('touchstart', function() {
     game.popScene (Menu);
     status();
   });

   menuiven.on ('touchstart', function() {     
     game.replaceScene (Inven);
     useitem = true;
   });

   menufile.on ('touchstart', function() {     
     game.replaceScene (File);
   });


   menuback.on ('touchstart', function() {
     game.popScene (Menu);
   });
   
   Menu.addChild(menucur);
   Menu.addChild(menustat);
   Menu.addChild(menuiven);
   Menu.addChild(menufile);   
   Menu.addChild(menuback);
   Menu.addChild(ttt);
   Menu.backgroundColor = 'rgba(0, 0, 0, 0.3)';


//인벤토리
   
   var inventory = [1, 0, 0, 0, 0, 0, 0, 0];

   var itemnum = 1 ;

   var itemselect;

   var itemslot;
      
   var selling = false;  

   var Inven = new Scene (320, 320);

   var invencur = new Sprite (300, 20);
   invencur.moveTo (10, 5);
   invencur.backgroundColor = 'black';

   var itemlist1 = new Label ('');
   itemlist1.color = 'white';
   itemlist1.moveTo (10, 10);   
   var itemlist2 = new Label ('');
   itemlist2.color = 'white';
   itemlist2.moveTo (10, 40);   
   var itemlist3 = new Label ('');
   itemlist3.color = 'white';
   itemlist3.moveTo (10, 70);
   var itemlist4 = new Label ('');
   itemlist4.color = 'white';
   itemlist4.moveTo (10, 100);   
   var itemlist5 = new Label ('');
   itemlist5.color = 'white';
   itemlist5.moveTo (10, 130);   
   var itemlist6 = new Label ('');
   itemlist6.color = 'white';
   itemlist6.moveTo (10, 160);   
   var itemlist7 = new Label ('');
   itemlist7.color = 'white';
   itemlist7.moveTo (10, 190);   
   var itemlist8 = new Label ('');
   itemlist8.color = 'white';
   itemlist8.moveTo (10, 220);   
   var itemexit = new Label ('뒤로');
   itemexit.color = 'white';
   itemexit.moveTo (10, 250);

   var itemtxtre = function () {
    itemlist1.text = ' ' + item[inventory[0]].name + ' : ' + item[inventory[0]].text + '     ' + item[inventory[0]].price + 'G';
    itemlist2.text = ' ' + item[inventory[1]].name + ' : ' + item[inventory[1]].text + '     ' + item[inventory[1]].price + 'G';
    itemlist3.text = ' ' + item[inventory[2]].name + ' : ' + item[inventory[2]].text + '     ' + item[inventory[2]].price + 'G';
    itemlist4.text = ' ' + item[inventory[3]].name + ' : ' + item[inventory[3]].text + '     ' + item[inventory[3]].price + 'G';
    itemlist5.text = ' ' + item[inventory[4]].name + ' : ' + item[inventory[4]].text + '     ' + item[inventory[4]].price + 'G';
    itemlist6.text = ' ' + item[inventory[5]].name + ' : ' + item[inventory[5]].text + '     ' + item[inventory[5]].price + 'G';
    itemlist7.text = ' ' + item[inventory[6]].name + ' : ' + item[inventory[6]].text + '     ' + item[inventory[6]].price + 'G';
    itemlist8.text = ' ' + item[inventory[7]].name + ' : ' + item[inventory[7]].text + '     ' + item[inventory[7]].price + 'G';
   };

   itemtxtre();

   Inven.on ('enterframe', function() {
     if (invencur.y < 230 && game.input.down) {
       invencur.y += 30;
       game.input.down = false;
     } else if (invencur.y > 5 && game.input.up) {
       invencur.y -= 30;
       game.input.up = false;
     }
    });

   Inven.on ('abuttondown', function() {
     if (invencur.y == 5) {
       game.popScene (Inven);
       itemselect = inventory[0];
       itemslot = 0;
     } else if (invencur.y == 35) {
       game.popScene (Inven);
       itemselect = inventory[1];
       itemslot = 1;
     } else if (invencur.y == 65) {
       game.popScene (Inven);
       itemselect = inventory[2];
       itemslot = 2;
     } else if (invencur.y == 95) {
       game.popScene (Inven);
       itemslot = 3;
       itemselect = inventory[3];
     } else if (invencur.y == 125) {
       game.popScene (Inven);
       itemslot = 4;
       itemselect = inventory[4];
     } else if (invencur.y == 155) {
       game.popScene (Inven);
       itemselect = inventory[5];
       itemslot = 5;
     } else if (invencur.y == 185) {
       game.popScene (Inven);
       itemselect = inventory[6];
       itemslot = 6;
     } else if (invencur.y == 215) {
       game.popScene (Inven);
       itemselect = inventory[7];
       itemslot = 7;
     } else if (invencur.y == 245) {
       game.popScene (Inven);
       selling = false;
       useitem = false;
     }
   });

   itemlist1.on ('touchstart', function() {
     game.popScene (Inven);
     itemselect = inventory[0];
     itemslot = 0;
   });
   itemlist2.on ('touchstart', function() {
     game.popScene (Inven);
     itemselect = inventory[1];
     itemslot = 1;
   });
   itemlist3.on ('touchstart', function() {
     game.popScene (Inven);
     itemselect = inventory[2];
     itemslot = 2;
   });
   itemlist4.on ('touchstart', function() {
     game.popScenee (Inven);
     itemselect = inventory[3];
     itemslot = 3;
   });
   itemlist5.on ('touchstart', function() {
     game.popScene (Inven);
     itemselect = inventory[4];
     itemslot = 4;
   });
   itemlist6.on ('touchstart', function() {
     game.popScene (Inven);
     itemselect = inventory[5];
     itemslot = 5;
   });
   itemlist7.on ('touchstart', function() {
     game.popScene (Inven);
     itemselect = inventory[6];
     itemslot = 6;
   });
   itemlist8.on ('touchstart', function() {
     game.popScene (Inven);
     itemselect = inventory[7];
     itemslot = 7;
   });
   itemexit.on ('touchstart', function() {
     game.popScene (Inven);
     selling = false;
     useitem = false;
   });

   Inven.addChild(invencur);
   Inven.addChild(itemlist1);
   Inven.addChild(itemlist2);
   Inven.addChild(itemlist3);
   Inven.addChild(itemlist4);
   Inven.addChild(itemlist5);
   Inven.addChild(itemlist6);
   Inven.addChild(itemlist7);
   Inven.addChild(itemlist8);
   Inven.addChild(itemexit);
   Inven.backgroundColor = 'rgba(0, 0, 0, 0.3)';


// 파일씬

   var File = new Scene(320, 320);
   var filecur = new Sprite(140, 20);
   filecur.backgroundColor = 'black';
   filecur.moveTo (80, 100);

   var filesave = new Label ("저장하기");
   filesave.color = 'white';
   filesave.textAlign = 'center';
   filesave.font = 'bold 20px 돋움';
   filesave.y = 100;

   var fileload = new Label ("불러오기");
   fileload.color = 'white';
   fileload.textAlign = 'center';
   fileload.font = 'bold 20px 돋움';
   fileload.y = 140;

   var fileback = new Label ("뒤로가기");
   fileback.color = 'white';
   fileback.textAlign = 'center';
   fileback.font = 'bold 20px 돋움';
   fileback.y = 180;

   File.on ('enterframe', function() {
     if (filecur.y < 180 && game.input.down) {
       filecur.y += 40;
       game.input.down = false;
     } else if (filecur.y > 100 && game.input.up) {
       filecur.y -= 40;
       game.input.up = false;
     }
    });
     

   File.on ('abuttondown', function() {
     if (filecur.y == 100) {
       window.localStorage.setItem('PLAYERX', player.x);
       window.localStorage.setItem('PLAYERY', player.y);
       window.localStorage.setItem('EXP', player_exp);
       window.localStorage.setItem('NEXTEXP', player_nextexp);
       window.localStorage.setItem('HP', player_hp);
       window.localStorage.setItem('MAXHP', player_maxhp);
       window.localStorage.setItem('MP', player_mp);
       window.localStorage.setItem('MAXMP', player_maxmp);
       window.localStorage.setItem('MONEY', player_money);
       window.localStorage.setItem('INVENTORY', JSON.stringify(inventory));
       game.popScene (File);
     } else if (filecur.y == 140) {
       player.x = parseInt(window.localStorage.getItem ('PLAYERX'));
       player.y = parseInt(window.localStorage.getItem ('PLAYERY'));
       player_exp = parseInt(window.localStorage.getItem ('EXP'));
       player_nextexp= parseInt(window.localStorage.getItem ('NEXTEXP')); 
       player_hp = parseInt(window.localStorage.getItem ('HP'));
       player_maxhp = parseInt(window.localStorage.getItem ('MAXHP'));
       player_mp = parseInt(window.localStorage.getItem ('MP'));
       player_maxmp = parseInt(window.localStorage.getItem ('MAXMP'));
       player_money = parseInt(window.localStorage.getItem ('MONEY'));
       inventory = window.localStorage.getItem ('INVENTORY');
       inventory = JSON.parse(inventory);
       itemtxtre();
       game.popScene (File);
     } else {
       game.popScene (File);
     }
   });

    filesave.on ('touchstart', function() {
       window.localStorage.setItem('PLAYERX', player.x);
       window.localStorage.setItem('PLAYERY', player.y);
       window.localStorage.setItem('EXP', player_exp);
       window.localStorage.setItem('NEXTEXP', player_nextexp);
       window.localStorage.setItem('HP', player_hp);
       window.localStorage.setItem('MAXHP', player_maxhp);
       window.localStorage.setItem('MP', player_mp);
       window.localStorage.setItem('MAXMP', player_maxmp);
       window.localStorage.setItem('MONEY', player_money);
       window.localStorage.setItem('INVENTORY', JSON.stringify(inventory));
       game.popScene (File);
   });

   fileload.on ('touchstart', function() {     
       player.x = parseInt(window.localStorage.getItem ('PLAYERX'));
       player.y = parseInt(window.localStorage.getItem ('PLAYERY'));
       player_exp = parseInt(window.localStorage.getItem ('EXP'));
       player_nextexp= parseInt(window.localStorage.getItem ('NEXTEXP')); 
       player_hp = parseInt(window.localStorage.getItem ('HP'));
       player_maxhp = parseInt(window.localStorage.getItem ('MAXHP'));
       player_mp = parseInt(window.localStorage.getItem ('MP'));
       player_maxmp = parseInt(window.localStorage.getItem ('MAXMP'));
       player_money = parseInt(window.localStorage.getItem ('MONEY'));
       inventory = window.localStorage.getItem ('INVENTORY');
       inventory = JSON.parse(inventory);
       itemtxtre();
       game.popScene (File);
   });

   fileback.on ('touchstart', function() {
     game.popScene (Menu);
   });
   
   File.addChild(filecur);
   File.addChild(filesave);
   File.addChild(fileload);
   File.addChild(fileback);
   File.backgroundColor = 'rgba(0, 0, 0, 0.3)';


// 상점 인벤토리

   var shop = [1, 2, 3, 4];

   var shoping = false;

   var Shop = new Scene (320, 320);

   var shopcur = new Sprite(300, 20);
   shopcur.backgroundColor = 'black';
   shopcur.moveTo (10, 5);
   
   var sitemlist1 = new Label ('');
   sitemlist1.color = 'white';
   sitemlist1.moveTo (10, 10);
   sitemlist1.text = ' ' + item[shop[0]].name + ' : ' + item[shop[0]].text + '     ' + item[shop[0]].price + 'G';
   var sitemlist2 = new Label ('');
   sitemlist2.color = 'white';
   sitemlist2.moveTo (10, 40);
   sitemlist2.text = ' ' + item[shop[1]].name + ' : ' + item[shop[1]].text + '     ' + item[shop[1]].price + 'G';
   var sitemlist3 = new Label ('');
   sitemlist3.color = 'white';
   sitemlist3.moveTo (10, 70);
   sitemlist3.text = ' ' + item[shop[2]].name + ' : ' + item[shop[2]].text + '     ' + item[shop[2]].price + 'G';
   var sitemlist4 = new Label ('');
   sitemlist4.color = 'white';
   sitemlist4.moveTo (10, 100);
   sitemlist4.text = ' ' + item[shop[3]].name + ' : ' + item[shop[3]].text + '     ' + item[shop[3]].price + 'G';
   var sitemexit = new Label ('뒤로');
   sitemexit.color = 'white';
   sitemexit.moveTo (10, 130);

   Shop.on ('enterframe', function() {
     if (shopcur.y < 100 && game.input.down) {
       shopcur.y += 30;
       game.input.down = false;
     } else if (shopcur.y > 5 && game.input.up) {
       shopcur.y -= 30;
       game.input.up = false;
     }
    });

   Shop.on ('abuttondown', function() {
     if (shopcur.y == 5) {
       game.popScene (Shop);
       itemselect = shop[0];
     } else if (shopcur.y == 35) {
       game.popScene (Shop);
       itemselect = shop[1];
     } else if (shopcur.y == 65) {
       game.popScene (Shop);
       itemselect = shop[2];
     } else if (shopcur.y == 95) {
       game.popScene (Shop);
       itemselect = shop[3];
     } else if (shopcur.y == 125) {
       game.popScene (Shop);
       shoping = false;
     }
   });

   sitemlist1.on ('touchstart', function() {
     game.popScene (Shop);
       itemselect = shop[0];
   });
   sitemlist2.on ('touchstart', function() {
     game.popScene (Shop);
       itemselect = shop[1];
   });
   sitemlist3.on ('touchstart', function() {
     game.popScene (Shop);
       itemselect = shop[2];
   });
   sitemlist4.on ('touchstart', function() {
     game.popScene (Shop);
       itemselect = shop[3];
   });
   sitemexit.on ('touchstart', function() {
     game.popScene (Shop);
       shoping = false;
   });

   Shop.addChild(shopcur);
   Shop.addChild(sitemlist1);
   Shop.addChild(sitemlist2);
   Shop.addChild(sitemlist3);
   Shop.addChild(sitemlist4);
   Shop.addChild(sitemexit);
   Shop.backgroundColor = 'rgba(0, 0, 0, 0.3)';

//전투 씬
 
  var monster = mon001;
  var playernum;
  var monsternum;

  var massage = new Label ('');
  massage.color = 'white';
  massage.moveTo (10, 10);

  var Batt = new Scene (320, 320);
  
  var battcur = new Sprite(300, 20);
   battcur.backgroundColor = 'black';
   battcur.moveTo (10, 175);
   
  var mon = new Sprite (32, 32);
  mon.image = game.assets[monster[5]];
  mon.frame = monster[6];
  mon.moveTo (150, 100);
  mon.scale (2, 2);

  var battattack = new Label ('공격하기');
   battattack.color = 'white';
   battattack.moveTo (10, 180);
  var battmagic = new Label ('마법사용');
   battmagic.color = 'white';
   battmagic.moveTo (10, 210);
  var battesc = new Label ('도망가기');
   battesc.color = 'white';
   battesc.moveTo (10, 240);
    
  var monster_hp = monster[1];

  Batt.on ('enterframe', function() {
     if (battcur.y < 235 && game.input.down) {
       battcur.y += 30;
       game.input.down = false;
     } else if (battcur.y > 175 && game.input.up) {
       battcur.y -= 30;
       game.input.up = false;
     }
    });

  Batt.on ('abuttondown', function() {
     if (battcur.y == 175) {
         playernum = Math.floor(Math.random() * 10);
         monsternum = Math.floor(Math.random() * 10);
         if (playernum >= monsternum) {
           massage.text = '공격에 성공했다!' + monster[0] + '에게' + player_attack + '데미지를 주었다!';
           monster_hp -= player_attack;
           mon.tl.scaleBy (0.5, 5)
                 .scaleBy (2, 5);                  
         } else {
           massage.text = '반격당했다!' + monster[0] + '에게' + monster[2] + '데미지를 받았다!';
           player_hp -= monster[2];
           Batt.tl.moveBy (0, -40, 5)
                  .moveBy (0, 40, 5);
         }
     } else if (battcur.y == 205) {
        if (inventory.indexOf(3) == -1) {
          massage.text = '당신은 마법을 가지고 있지 않습니다!';
        } else if (player_mp <= 0) {
          massage.text = 'MP가 부족합니다.';
        } else {
          massage.text = '파이어볼을 사용했습니다. 적에게 5데미지!';
          monster_hp -= 5;
          player_mp -= 2;
        }
     } else if (battcur.y == 235) {
       game.popScene (Batt);
     }
   });

   battattack.on ('touchstart', function() {
         playernum = Math.floor(Math.random() * 10);
         monsternum = Math.floor(Math.random() * 10);
         if (playernum >= monsternum) {
           massage.text = '공격에 성공했다!' + monster[0] + '에게' + player_attack + '데미지를 주었다!';
           monster_hp -= player_attack;
           mon.tl.scaleBy (0.5, 5)
                 .scaleBy (2, 5);                  
         } else {
           massage.text = '반격당했다!' + monster[0] + '에게' + monster[2] + '데미지를 받았다!';
           player_hp -= monster[2];
           Batt.tl.moveBy (0, -40, 5)
                  .moveBy (0, 40, 5);
         }
   });
   battmagic.on ('touchstart', function() {
      if (inventory.indexOf(3) == -1) {
          massage.text = '당신은 마법을 가지고 있지 않습니다!';
        } else if (player_mp <= 0) {
          massage.text = 'MP가 부족합니다.';
        } else {
          massage.text = '파이어볼을 사용했습니다. 적에게 5데미지!';
          monster_hp -= 5;
          player_mp -= 2;
        }
   });
   battesc.on ('touchstart', function() {
     game.popScene (Batt);
   });

  Batt.on ('enterframe', function() {
    if (monster_hp <= 0) {
      player_exp += monster[3];
      player_money += monster[4];
      monster_hp = monster[1];
      say (monster[0] + '은 쓰러졌다!' + monster[4] + 'G를 얻었다!');
      game.popScene (Batt);
    }
    if (player_hp <= 0) {
      say ('전투에서 패배했습니다!');
      game.popScene (Batt);
    }
   });

  Batt.addChild(mon);
  Batt.addChild(battcur);
  Batt.addChild(battattack);
  Batt.addChild(battmagic);
  Batt.addChild(battesc);
  Batt.addChild(massage);
  Batt.backgroundColor = 'rgba(0, 0, 0, 0.3)';

//이벤트 작성

   var npc1 = new Sprite (32, 32);
   npc1.image = game.assets['img/chara0.png'];
   npc1.frame = 4;
   npc1.moveTo (280, 144);
   var npc1fx = function () {
    player.y += 4;
    game.pushScene (Shop);
    shoping = true;
    npc1.on ('enterframe', function () {
     if (shoping) {
       say (item[itemselect].name + '을 구입하시겠습니까?');
       yesorno();
       if (game.input.left) {
        if (player_money - item[itemselect].price >= 0 && itemnum < 8) {
          player_money -= item[itemselect].price;
          inventory[itemnum] = itemselect;
          itemnum += 1;
          itemtxtre();
          shoping = false;
          sayend();
         } else {
          say('죄송하지만 구입이 불가능 하십니다.');
         }
       } else if (game.input.up) {
        shoping = false;
       } else if (game.input.down) {
        shoping = false;
       } else if (game.input.right) {
        shoping = false;
       }
      }
    });
   };

   var npc2 = new Sprite (32, 32);
   npc2.image = game.assets['img/chara0.png'];
   npc2.frame = 7;
   npc2.moveTo (296, 144);
   var npc2fx = function () {
    player.y += 4;
    game.pushScene (Inven);
    selling = true;
    npc2.on ('enterframe', function () {
     if (selling) {
       say (item[itemselect].name + '을 판매하시겠습니까?');
       yesorno();
       if (game.input.left) {
        player_money += item[itemselect].price;
        inventory.splice (itemslot, 1);
        inventory.push (0);
        itemnum -= 1;
        itemtxtre();
        selling = false;
        sayend();
       } else if (game.input.up) {
        selling = false;
       } else if (game.input.down) {
        selling = false;
       } else if (game.input.right) {
        selling = false;
        sayend();
       }
      }
    });
   };

   var npc3 = new Sprite (32, 32);
   npc3.image = game.assets['img/chara6.png'];
   npc3.frame = 2;
   npc3.moveTo (200, 368);
   npc3.on ('enterframe', function() {
     npc3.frame += 0.1;
     npc3.frame %= 3;
     npc3.tl.moveBy (32, 0, 48)
            .moveBy (0, 32, 48)
            .moveBy (-32, 0, 48)
            .moveBy (0, -32, 48)
            .loop();
     if (player.intersect(npc3)){
       stage.removeChild (npc3);
       monster = mon001;
       massage.text = mon001[0] + '이 나타났다!';
       game.pushScene (Batt);
     }
   });

   game.rootScene.on ('abuttondown', function() {
     sayend();
     game.pushScene (Menu);
   });

   player.on ('touchstart', function() {
     sayend();
     game.pushScene (Menu);
   });


//스크롤및 방향패드

   var stage = new Group();
   stage.addChild(map);
   stage.addChild(player);
   stage.addChild(npc1);
   stage.addChild(npc2);
   stage.addChild(npc3);
   stage.addChild(formap);
   stage.addChild(textBox);
   stage.addChild(textLabel);
   stage.addChild(Yes);
   stage.addChild(No);
   game.rootScene.addChild(stage);

   var pad = new Pad();
   pad.x = 0;
   pad.y = 220;
   game.rootScene.addChild(pad);

   game.rootScene.on('enterframe', function(e) {
     var x = Math.min((game.width  - 16) / 2 - player.x, 0);
     var y = Math.min((game.height - 16) / 2 - player.y, 0);
     x = Math.max(game.width,  x + map.width)  - map.width; 
     y = Math.max(game.height, y + map.height) - map.height;
     stage.x = x;
     stage.y = y;
   });
  };
  game.start();
};