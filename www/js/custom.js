  
 var user_name;
 var pwd;
 var db;
 var last_identityID;
 var getID;
function onBackKeyDown(){
    if ($.mobile.activePage.is("#login_page")){
        navigator.app.exitApp();
    }
    else{
        navigator.app.backHistory(); 
    }
}

function onDeviceReady(){
    var networkStatus = navigator.connection.type;
    if(networkStatus == Connection.NONE){
    $('.network_alert').show();
   } 
    db = window.openDatabase("Database", "1.0", "Mobile Datacollection", 2*1024*1024);
    db.transaction(createIdentity, errorCB, successCB);
    db.transaction(createMember,errorCB);
    db.transaction(createDeath,errorCB);
    db.transaction(createAgr,errorCB);
}

function loginAuthentication(){/* the loginAuthentication function is used to validate the enumerator */
    $.mobile.loading('show');
    user_name = document.getElementById("username").value;
    pwd = document.getElementById("password").value;
    var networkStatus = navigator.connection.type;
    if(networkStatus == Connection.NONE){    
       localAuthentication();
       }
    else{
    $.ajax ({ /*Posting login credentials to the server by ajax method for validation*/
        type: 'POST',
        url: 'http://192.168.43.180/datacollection/datacollection/validateEnumerator',
        data: {
            username:user_name,
            password:pwd
        },
        success: function(response){
            if(response != '0'){
                window.localStorage.setItem("userID",response); /*Store the enumeratorID in device database*/
                window.localStorage.setItem("local_username",user_name);
                window.localStorage.setItem("local_passwd",pwd);
                $.mobile.changePage("#main_page");              
            }
            else{
               navigator.notification.alert('Invalid username or password!','Error!','Error!');
               $.mobile.loading('hide');
                         }
        }
    });
    return false;
    } 
} 

function logout(){
    //window.localStorage.clear();
    $("#loginForm").trigger("reset");
    $.mobile.changePage("#login_page");
}
function updateLogin(){
   $.mobile.loading('show');
   var networkState = navigator.connection.type;
   if(networkState == Connection.NONE){
    navigator.notification.alert("No Internet access",'Error!','Error!');
    $.mobile.loading('hide');
   }
   else{
    var name = $("#new_username").val();
    var passwd = $("#new_password").val();
    var ID = window.localStorage.getItem("userID");
    if ( name != '' && passwd != ''){
    $.ajax({
        type:'POST',
        url: 'http://192.168.43.180/datacollection/datacollection/newLogin_info',
        data:{ username:name, password:passwd,enumeratorID:ID},
        success: function(response){
            if(response == '1'){
                navigator.notification.alert('Information Successfull updated','Success','Success');
                $.mobile.loading('hide');
                $.mobile.changePage("#questionnaire");
            }
            else{
                navigator.notification.alert('error updating information','Error!','Error!');
                $.mobile.loading('hide');
            }
        }
    });
    }
    else{
        navigator.notification.alert('Invalid username or password','Error!','Error!');
        $.mobile.loading('hide');
    }
   return false;
 }
}

function getLocation(){
    /* using the device API to get the current position*/
    $.mobile.loading('show');
    navigator.geolocation.getCurrentPosition(onSuccess,onError,{enableHighAccuracy: true});
}

function onSuccess(position){/*If the location is success full obtained*/
    $("#latitude").val(position.coords.latitude);
    $("#longitude").val(position.coords.longitude);
    $.mobile.loading('hide');
}

function onError(){/*If there is an error in obtaining the location*/
    navigator.notification.alert('Please turn on GPS','Notification','Notification');
    $.mobile.loading('hide');
}

function saveIdentity(){
    $.mobile.loading('show'); 
    var ID = window.localStorage.getItem("userID");
    var reg = $("#region").val();
    var dist = 'district_'+reg;
    var name = '[name="'+dist+'"]';
    var districtval = $(name).val();
    var formData = $("#identity_form").serialize()+"&enumeratorID="+ID+"&distr="+districtval; 
    var networkStatus = navigator.connection.type;
    if(networkStatus == Connection.NONE){
        local_saveIdentity();
        }
    else {
    $.ajax({
        type: 'POST',
        url: 'http://192.168.43.180/datacollection/datacollection/saveIdentity',
        data: formData,
        success: function(response){
            if(response != '0'){
                window.localStorage.setItem("familyID",response);
                navigator.notification.alert('Identity Information Saved','Success','Success');
                $("#identity_form").trigger("reset");
                $.mobile.loading('hide');
                $.mobile.changePage("#questionnaire");
                $("#memberBtn").removeClass('ui-disabled');
            }
            else{
                navigator.notification.alert('Error uploading identity information','Error!','Error!');
                $.mobile.loading('hide');
            }
        }
       
    });
    }
}


function saveMember(){
    $.mobile.loading('show'); 
    var family_id = window.localStorage.getItem("familyID");
    var formData = $("#member_form").serialize()+"&familyID="+family_id; 
    var networkStatus = navigator.connection.type;
    if(networkStatus == Connection.NONE){
        local_saveMember();
        }
    else {
  $.ajax({
        type: 'POST',
        url: 'http://192.168.43.180/datacollection/datacollection/saveMember',
        data: formData,
        success: function(response){
            if(response != '0'){
                window.localStorage.setItem("memberID",response);
                navigator.notification.alert('Member Information Saved','Success','Success');
                $("#member_form").trigger("reset");
                $.mobile.loading('hide');
                $("#deathBtn").removeClass('ui-disabled');
            }
            else{
                navigator.notification.alert('Error uploading member information','Error!','Error!');
                $.mobile.loading('hide');
            }
        }
    });
    }
}

function saveDeath(){
    $.mobile.loading('show'); 
    var family_id = window.localStorage.getItem("familyID");
    var formData = $("#death_form").serialize()+"&familyID="+family_id; 
    var networkStatus = navigator.connection.type;
    if(networkStatus == Connection.NONE){
        local_saveDeath();
        }
    else{
      $.ajax({
            type: 'POST',
            url: 'http://192.168.43.180/datacollection/datacollection/saveDeath',
            data: formData,
            success: function(response){
                if(response == '1'){
                    navigator.notification.alert('Death Information Saved','Success','Success');
                    $("#death_form").trigger("reset");
                    $.mobile.loading('hide');
                    $("#agrBtn").removeClass('ui-disabled');
                }
                else{
                    navigator.notification.alert('error uploading death information','Error!','Error!');
                    $.mobile.loading('hide');
                }
            }
        });
    }       
}

function saveAgr(){
   $.mobile.loading('show'); 
    var family_id = window.localStorage.getItem("familyID");
    var formData = $("#agriculture_form").serialize()+"&familyID="+family_id;
    var networkStatus = navigator.connection.type; 
    if(networkStatus == Connection.NONE){
        local_saveAgr();
        }
    else{
      $.ajax({
            type: 'POST',
            url: 'http://192.168.43.180/datacollection/datacollection/saveAgr',
            data: formData,
            success: function(response){
                if(response == '1'){
                    navigator.notification.alert('Agriculture Information Saved','Success','Success');
                    $.mobile.loading('hide');
                    $.mobile.changePage("#questionnaire");
                }
                else{
                    navigator.notification.alert('error uploading information','Error!','Error!');
                    $.mobile.loading('hide');
                }
            }
        });
    }
}

function localAuthentication(){
   if( user_name == window.localStorage.getItem("local_username") && pwd == window.localStorage.getItem("local_passwd")){
      $.mobile.changePage("#main_page");
   }
   else{
      navigator.notification.alert('Invalid username or password','Error!','Error!');
      $.mobile.loading('hide');
    }   
}

function createIdentity(tx){
     tx.executeSql('CREATE TABLE IF NOT EXISTS IDENTITY (id INTEGER PRIMARY KEY AUTOINCREMENT,region VARCHAR(30),district VARCHAR(45),ward VARCHAR(45),village VARCHAR(45),household VARCHAR(30),lat FLOAT(10,6),lon FLOAT(10,6),time VARCHAR(25))');
     
}
function createMember(tx){
     tx.executeSql('CREATE TABLE IF NOT EXISTS MEMBER (id INTEGER PRIMARY KEY AUTOINCREMENT,fname VARCHAR(30),midname VARCHAR(60),lname VARCHAR(30),sex CHAR(6),'+
                    'age SMALLINT, relationshp VARCHAR(30),maritalstatus VARCHAR(30), citizenship VARCHAR(30),residence VARCHAR(30),birth CHAR(3),'+
                    'disability VARCHAR(30), ssf VARCHAR(30),literacy VARCHAR(30),level VARCHAR(30),familyID INTEGER)');     
}

function createDeath(tx){
    tx.executeSql('CREATE TABLE IF NOT EXISTS DEATH (id INTEGER PRIMARY KEY AUTOINCREMENT,deceasedGender CHAR(6),deceasedAge SMALLINT,cause VARCHAR(30),familyID INTEGER)');  
}

function createAgr(tx){
    tx.executeSql('CREATE TABLE IF NOT EXISTS AGR (id INTEGER PRIMARY KEY AUTOINCREMENT,crops VARCHAR(20),livestock VARCHAR(20),familyID INTEGER)');    
}

function errorCB(err) {
        alert("Error processing SQL: "+err.message);
}

function successCB() {
    alert("database successfull created!");
}

function local_saveIdentity(){
     db.transaction(insertIdentity,errorCB);
     return false;
}

function insertIdentity(tx){
    var    reg = $("#region").val();
    var    dist = 'district_'+reg;
    var    name = '[name="'+dist+'"]';
    var    districtval = $(name).val();
    var    ward = $("#ward").val();
    var    village = $("#village").val();
    var    lat = $("#latitude").val();
    var    lon = $("#longitude").val();
    var    house = $("#household").val();
    var    t = $("#time").val();
       sql = 'INSERT INTO IDENTITY (region,district,ward,village,household,lat,lon,time) VALUES (?,?,?,?,?,?,?,?)';
       tx.executeSql(sql,[reg,districtval,ward,village,house,lat,lon,t],
       function(tx,results){
        last_identityID = results.insertId;
       },errorCB);   
       navigator.notification.alert('Identity Information Saved','Success','Success');
       $("#identity_form").trigger("reset");
       $.mobile.loading('hide');
       $.mobile.changePage("#questionnaire");
       $("#memberBtn").removeClass('ui-disabled');
}

function local_saveMember(){
        
       db.transaction(insertMember,errorCB);
       return false;    
}

function insertMember(tx){
    var fname = $("#first_name").val();
        mname = $("#middle_name").val();
        lname = $("#last_name").val();
        sex = $("#gender").val();
        age = $("#age").val();
        rel = $("#relationship").val();
        birth = $("#birthCert").val();
        marital = $("#maritalStatus").val();
        citizen = $("#country").val();
        res = $("#residence").val();
        literacy = $("#literacy").val();
        if(literacy == 13){
            level = 'never atteded';
        }else{
        level = $("#education_level").val();
        }
        if($("#checkDisability").val() == 'yes' && $("#checkFund").val() == 'yes'){
        disability = [];
        $("#disability input:checked").each(function(){
            disability.push($(this).val());
        });
        ssf = [];
        $("#socialFund input:checked").each(function(){
            ssf.push($(this).val());
        });
        sql = 'INSERT INTO MEMBER (fname,midname,lname,sex,age,relationshp,maritalstatus,citizenship,residence,birth,'+
                                  'disability,ssf,literacy,level,familyID) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        tx.executeSql(sql,[fname,mname,lname,sex,age,rel,marital,citizen,res,birth,disability,ssf,literacy,level,last_identityID]);
        } 
        else if($("#checkDisability").val() == 'yes' && $("#checkFund").val() == 'no'){
        disability = [];
        $("#disability input:checked").each(function(){
            disability.push($(this).val());
        }); 
        sql = 'INSERT INTO MEMBER (fname,midname,lname,sex,age,relationshp,maritalstatus,citizenship,residence,birth,'+
                                  'disability,literacy,level,familyID) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        tx.executeSql(sql,[fname,mname,lname,sex,age,rel,marital,citizen,res,birth,disability,literacy,level,last_identityID]);
        }
        else if($("#checkDisability").val() == 'no' && $("#checkFund").val() == 'yes'){
        ssf = [];
        $("#socialFund input:checked").each(function(){
            ssf.push($(this).val());
        });
        sql = 'INSERT INTO MEMBER (fname,midname,lname,sex,age,relationshp,maritalstatus,citizenship,residence,birth,'+
                                  'ssf,literacy,level,familyID) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        tx.executeSql(sql,[fname,mname,lname,sex,age,rel,marital,citizen,res,birth,ssf,literacy,level,last_identityID]);
        }
        else{
        sql = 'INSERT INTO MEMBER (fname,midname,lname,sex,age,relationshp,maritalstatus,citizenship,residence,birth,'+
                                  'literacy,level,familyID) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
        tx.executeSql(sql,[fname,mname,lname,sex,age,rel,marital,citizen,res,birth,literacy,level,last_identityID]);
        }
       navigator.notification.alert('Member Information Saved','Success','Success');
       $("#member_form").trigger("reset");
       $.mobile.loading('hide');
       $("#deathBtn").removeClass('ui-disabled');
}

function local_saveDeath(){
     db.transaction(insertDeath,errorCB);
     return false;
}

function insertDeath(tx){
    if($("#checkDeath").val() == 'yes'){
       var gender = $("#deceased_Gender").val();
           age = $("#deceased_Age").val();
           cause = $("#cause_of_death").val();
       sql = 'INSERT INTO DEATH (deceasedGender,deceasedAge,cause,familyID) VALUES (?,?,?,?)';
       tx.executeSql(sql,[gender,age,cause,last_identityID]);
       navigator.notification.alert('Death information saved','Success','Success'); 
       $("#death_form").trigger("reset");
       $.mobile.loading('hide');
       $("#agrBtn").removeClass('ui-disabled');   
    }
}

function local_saveAgr(){
    db.transaction(insertAgr,errorCB);
    return false;
}

function insertAgr(tx){
    if($("#checkAgr").val() == 'yes' && $("#checkLivestk").val() == 'yes'){
    crops = [];
        $("#agriculture input:checked").each(function(){
            crops.push($(this).val());
        });
        lvstk = [];
        $("#livestock input:checked").each(function(){
            lvstk.push($(this).val());
        });
        sql = 'INSERT INTO AGR (crops,livestock,familyID) VALUES (?,?,?)';
        tx.executeSql(sql,[crops,lvstk,last_identityID]);
    }
    else if ($("#checkAgr").val() == 'yes' && $("#checkLivestk").val() == 'no'){
    crops = [];
        $("#agriculture input:checked").each(function(){
            crops.push($(this).val());
        }); 
        sql = 'INSERT INTO AGR (crops,familyID) VALUES (?,?)';
        tx.executeSql(sql,[crops,last_identityID]);       
    }
    else if ($("#checkAgr").val() == 'no' && $("#checkLivestk").val() == 'yes'){
        lvstk = [];
        $("#livestock input:checked").each(function(){
            lvstk.push($(this).val());
        }); 
        sql = 'INSERT INTO AGR (livestock,familyID) VALUES (?,?)';
        tx.executeSql(sql,[lvstk,last_identityID]);       
    }
    navigator.notification.alert('Agriculture Information Saved','Success','Success');
    $.mobile.loading('hide');
    $.mobile.changePage("#questionnaire");
}

function viewIdentity(){
    $.mobile.loading('show');
    db.transaction(queryIdentity,errorCB);
    $.mobile.loading('hide');
}
function queryIdentity(tx){
    tx.executeSql('SELECT * FROM identity',[],renderIdentity);
}

function renderIdentity(tx,results){
    var htmlstring = '';
    var len = results.rows.length; // get the number of rows
    for(var i = 0; i<len; i++){
      htmlstring += '<table><tr><td><li><label><b>Location No. :</b></label></td><td><input type="text" readonly data-mini="true" name="loc_id[]" value="'+ results.rows.item(i).id + '"style="color:#0033FF;"/></tr></td>' +
                           '<tr><td><label><b>Region:</b></label></td><td><input type="text" name="loc_reg" readonly data-mini="true" value="'+results.rows.item(i).region+ '"style="color:#0033FF;"/></tr></td>' +
                           '<tr><td><label><b>District:</b></label></td><td><input type="text" name="loc_dist" readonly data-mini="true" value="'+results.rows.item(i).district + '"style="color:#0033FF;"/></tr></td>' + 
                           '<tr><td><label><b>Ward:</b></label></td><td><input type="text" name="loc_wd" readonly data-mini="true" value="' + results.rows.item(i).ward + '"style="color:#0033FF;"/></tr></td>' + 
                           '<tr><td><label><b>Village/Street:</b></label></td><td><input type="text" name="loc_wd" readonly data-mini="true" value="' + results.rows.item(i).village + '"style="color:#0033FF;"/></tr></td>' + 
                           '<tr><td><label><b>Household Name:</b></label></td><td><input type="text" name="loc_vlg" readonly data-mini="true" value="' +results.rows.item(i).household + '"style="color:#0033FF;"/></tr></td>' +
                           '<tr><td><label><b>Latitude:</b></label></td><td><input type="text" name="loc_lat" readonly data-mini="true" value="' + results.rows.item(i).lat + '"style="color:#0033FF;"/></tr></td>' + 
                           '<tr><td><label><b>Longitude:</b></label></td><td><input type="text" name="loc_lon" readonly data-mini="true" value="' + results.rows.item(i).lon +  '"style="color:#0033FF;"/></tr></td>' +
                           '<tr><td><label><b>Time:</b></label></td><td><input type="text" name="loc_tm" readonly data-mini="true" value="' + results.rows.item(i).time + '"style="color:#0033FF;"/></tr></td>' +
                           '<tr><td></td><td><div id="'+i+'"><a data-role="button" class="viewMore" href="#queue_viewRecord">View More</a></div></li></tr></td></table>'; 
    }
    $("#savedLocation").html(htmlstring);
    $("#savedLocation").listview().listview('refresh');
}

/*function view(){
    var htmlstring = '';
    htmlstring += '<li  style="border-bottom:3px solid black;"><p><label style="width:12em; display:inline-block;"><b>Location No. :</b></label><input type="text" readonly data-mini="true" name="loc_id[]" value="45"style="color:#0033FF;"/></p>' +
                           '<p><label style="width:12em; display:inline-block;"><b>Region:</b></label><input type="text" name="loc_reg" readonly data-mini="true" value="Arusha"style="color:#0033FF;"/></p>' +
                           '<p><label style="width:12em; display:inline-block;"><b>District:</b></label><input type="text" name="loc_dist" readonly data-mini="true" value="Arusha city"style="color:#0033FF;"/></p>' + 
                           '<p><label style="width:12em; display:inline-block;"><b>Ward:</b></label><input type="text" name="loc_wd" readonly data-mini="true" value="Majengo"style="color:#0033FF;"/></p>' + 
                           '<p><label style="width:12em; display:inline-block;"><b>Village/Street:</b></label><input type="text" name="loc_wd" readonly data-mini="true" value="shamsi"style="color:#0033FF;"/></p>' + 
                           '<p><label style="width:12em; display:inline-block;"><b>Household Name:</b></label><input type="text" name="loc_vlg" readonly data-mini="true" value="msuya"style="color:#0033FF;"/></p>' +
                           '<p><label style="width:12em; display:inline-block;"><b>Latitude:</b></label><input type="text" name="loc_lat" readonly data-mini="true" value="62.058394543"style="color:#0033FF;"/></p>' + 
                           '<p><label style="width:12em; display:inline-block;"><b>Longitude:</b></label><input type="text" name="loc_lon" readonly data-mini="true" value="-32.0938238"style="color:#0033FF;"/></p>' +
                           '<p><label style="width:12em; display:inline-block;"><b>Time:</b></label><input type="text" name="loc_tm" readonly data-mini="true" value="Mon May 5,2014"style="color:#0033FF;"/></p>'+
                           '<p><a data-role="button" class="viewMore" href="#">View More</a></p></li>';        

    $("#savedLocation").html(htmlstring+'<div class="appendDeath"><div>');
    another();
}
function another(){
     var htmlstring = '';
    htmlstring += '<li><p><label><b>Location No. :</b></label><input type="text" readonly data-mini="true" name="loc_id[]" value="45"style="color:#0033FF;"/></p>' +
                           '<label style="width:12em; display:inline-block;"><b>Region:</b></label><input type="text" name="loc_reg" readonly data-mini="true" value="Arusha"style="color:#0033FF;"/></p>' +
                           '<label style="width:12em; display:inline-block;"><b>District:</b></label><input type="text" name="loc_dist" readonly data-mini="true" value="Arusha city"style="color:#0033FF;"/></p>' + 
                           '<label style="width:12em; display:inline-block;"><b>Ward:</b></label><input type="text" name="loc_wd" readonly data-mini="true" value="Majengo"style="color:#0033FF;"/></p>' + 
                           '<label style="width:12em; display:inline-block;"><b>Village/Street:</b></label><input type="text" name="loc_wd" readonly data-mini="true" value="shamsi"style="color:#0033FF;"/></p>' + 
                           '<label style="width:12em; display:inline-block;"><b>Household Name:</b></label><input type="text" name="loc_vlg" readonly data-mini="true" value="msuya"style="color:#0033FF;"/></p>' +
                           '<label style="width:12em; display:inline-block;"><b>Latitude:</b></label><input type="text" name="loc_lat" readonly data-mini="true" value="62.058394543"style="color:#0033FF;"/></p>' + 
                           '<label style="width:12em; display:inline-block;"><b>Longitude:</b></label><input type="text" name="loc_lon" readonly data-mini="true" value="-32.0938238"style="color:#0033FF;"/></p>' +
                           '<label style="width:12em; display:inline-block;"><b>Time:</b></label><input type="text" name="loc_tm" readonly data-mini="true" value="Mon May 5,2014"style="color:#0033FF;"/></p>'+
                           '<a data-role="button" class="viewMore" href="#">View More</a></p></li>';
     $(".appendDeath").html(htmlstring);    
}*/

function getRecords(index){
    var id = [];
    $('[name="loc_id[]"]').each(function() {
    id.push($(this).val());
    });
     getID = id[index];
     db.transaction(queryRecords,errorCB); 
}

function queryRecords(tx){
        tx.executeSql('SELECT * FROM identity WHERE id=?',[getID],renderLocation,errorCB);
        tx.executeSql('SELECT * FROM member WHERE familyID=?',[getID],renderMember,errorCB);  
        tx.executeSql('SELECT * FROM death WHERE familyID=?',[getID],renderDeathinfo,errorCB); 
        tx.executeSql('SELECT * FROM agr WHERE familyID=?',[getID],renderAgrinfo,errorCB);
}

function renderLocation(tx,results){
    var htmlstring = '';
    var len = results.rows.length; // get the number of rows
    for(var i = 0; i<len; i++){
        htmlstring +='<li><p><label style="width:12em; display:inline-block;"><b>Location No. :</b></label><input type="text" readonly data-mini="true" name="loc_id" value="'+ results.rows.item(i).id + '"style="color:#0033FF;"/></p>' +
                           '<p><label style="width:12em; display:inline-block;"><b>Region:</b></label><input type="text" name="loc_reg" readonly data-mini="true" value="'+results.rows.item(i).region+ '"style="color:#0033FF;"/></p>' +
                           '<p><label style="width:12em; display:inline-block;"><b>District:</b></label><input type="text" name="loc_dist" readonly data-mini="true" value="'+results.rows.item(i).district + '"style="color:#0033FF;"/></p>' + 
                           '<p><label style="width:12em; display:inline-block;"><b>Ward:</b></label><input type="text" name="loc_wd" readonly data-mini="true" value="' + results.rows.item(i).ward + '"style="color:#0033FF;"/></p>' + 
                           '<p><label style="width:12em; display:inline-block;"><b>Village/Street:</b></label><input type="text" name="loc_vlg" readonly data-mini="true" value="' + results.rows.item(i).village + '"style="color:#0033FF;"/></p>' + 
                           '<p><label style="width:12em; display:inline-block;"><b>Household Name:</b></label><input type="text" name="loc_househld" readonly data-mini="true" value="' +results.rows.item(i).household + '"style="color:#0033FF;"/></p>' +
                           '<p><label style="width:12em; display:inline-block;"><b>Latitude:</b></label><input type="text" name="loc_lat" readonly data-mini="true" value="' + results.rows.item(i).lat + '"style="color:#0033FF;"/></p>' + 
                           '<p><label style="width:12em; display:inline-block;"><b>Longitude:</b></label><input type="text" name="loc_lon" readonly data-mini="true" value="' + results.rows.item(i).lon +  '"style="color:#0033FF;"/></p>' +
                           '<p><label style="width:12em; display:inline-block;"><b>Time:</b></label><input type="text" name="loc_tm" readonly data-mini="true" value="' + results.rows.item(i).time + '"style="color:#0033FF;"/></p></li>';
                           
    } 
    
    $(".appendLocation").html(htmlstring); 
    $(".appendLocation").listview().listview('refresh');  
}

function renderMember(tx,results){
    var htmlstring = '';
    var len = results.rows.length; // get the number of rows
    for(var i = 0; i<len; i++){
        htmlstring +='<li><p><label style="width:12em; display:inline-block;"><b>Member No. :</b></label><input type="text" readonly data-mini="true" name="mem_id'+i+'" value="'+ results.rows.item(i).id + '"style="color:#0033FF;"/></p>' +
                           '<p><label style="width:12em; display:inline-block;"><b>First Name:</b></label><input type="text" name="fname'+i+'" readonly data-mini="true" value="'+results.rows.item(i).fname+ '"style="color:#0033FF;"/></p>' +
                           '<p><label style="width:12em; display:inline-block;"><b>Middle Name:</b></label><input type="text" name="midname'+i+'" readonly data-mini="true" value="'+results.rows.item(i).midname + '"style="color:#0033FF;"/></p>' + 
                           '<p><label style="width:12em; display:inline-block;"><b>Last Name:</b></label><input type="text" name="lname'+i+'" readonly data-mini="true" value="' + results.rows.item(i).lname + '"style="color:#0033FF;"/></p>' + 
                           '<p><label style="width:12em; display:inline-block;"><b>Gender:</b></label><input type="text" name="gender'+i+'" readonly data-mini="true" value="' + results.rows.item(i).sex + '"style="color:#0033FF;"/></p>' + 
                           '<p><label style="width:12em; display:inline-block;"><b>Age:</b></label><input type="text" name="age'+i+'" readonly data-mini="true" value="' +results.rows.item(i).age + '"style="color:#0033FF;"/></p>' +
                           '<p><label style="width:12em; display:inline-block;"><b>Relationship with the head:</b></label><input type="text" name="relationshp'+i+'" readonly data-mini="true" value="' + results.rows.item(i).relationshp + '"style="color:#0033FF;"/></p>' + 
                           '<p><label style="width:12em; display:inline-block;"><b>Marital Status:</b></label><input type="text" name="maritalstatus'+i+'" readonly data-mini="true" value="' + results.rows.item(i).maritalstatus +  '"style="color:#0033FF;"/></p>' +
                           '<p><label style="width:12em; display:inline-block;"><b>Citizenship:</b></label><input type="text" name="citizenship'+i+'" readonly data-mini="true" value="' + results.rows.item(i).citizenship + '"style="color:#0033FF;"/></p>' +
                           '<p><label style="width:12em; display:inline-block;"><b>Residence:</b></label><input type="text" name="residence'+i+'" readonly data-mini="true" value="' + results.rows.item(i).residence + '"style="color:#0033FF;"/></p>' +
                           '<p><label style="width:12em; display:inline-block;"><b>Birthcertificate:</b></label><input type="text" name="birth'+i+'" readonly data-mini="true" value="' + results.rows.item(i).birth + '"style="color:#0033FF;"/></p>' +
                           '<p><label style="width:12em; display:inline-block;"><b>Disability:</b></label><input type="text" name="disability'+i+'" readonly data-mini="true" value="' + results.rows.item(i).disability + '"style="color:#0033FF;"/></p>' +
                           '<p><label style="width:12em; display:inline-block;"><b>Social Security Fund:</b></label><input type="text" name="ssf'+i+'" readonly data-mini="true" value="' + results.rows.item(i).ssf + '"style="color:#0033FF;"/></p>' +
                           '<p><label style="width:12em; display:inline-block;"><b>Literacy level:</b></label><input type="text" name="literacy'+i+'" readonly data-mini="true" value="' + results.rows.item(i).literacy + '"style="color:#0033FF;"/></p>' +
                           '<p><label style="width:12em; display:inline-block;"><b>Education level:</b></label><input type="text" name="education'+i+'" readonly data-mini="true" value="' + results.rows.item(i).level + '"style="color:#0033FF;"/></p></li>';
                           
    } 
    
    $(".appendMembers").html(htmlstring); 
    $(".appendMembers").listview().listview('refresh');  
}

function renderDeathinfo(tx,results){
    var htmlstring = '';
    var len = results.rows.length; // get the number of rows
    for(var i = 0; i<len; i++){
        htmlstring += '<li><p><label style="width:12em; display:inline-block;"><b>Deceased Geder:</b></label><input type="text" name="deceasedGender'+i+'" readonly data-mini="true" value="'+results.rows.item(i).deceasedGender+ '"style="color:#0033FF;"/></p>' +
                           '<p><label style="width:12em; display:inline-block;"><b>Deceased Age:</b></label><input type="text" name="deceasedAge'+i+'" readonly data-mini="true" value="'+results.rows.item(i).deceasedAge + '"style="color:#0033FF;"/></p>' + 
                           '<p><label style="width:12em; display:inline-block;"><b>Cause of Death:</b></label><input type="text" name="cause'+i+'" readonly data-mini="true" value="' + results.rows.item(i).cause + '"style="color:#0033FF;"/></p></li>'; 
    }
    $(".appendDeath").html(htmlstring);
    $(".appendDeath").listview().listview('refresh');
}

function renderAgrinfo(tx,results){
    var htmlstring = '';
    var len = results.rows.length; // get the number of rows
    for(var i = 0; i<len; i++){
        htmlstring += '<li><p><label style="width:12em; display:inline-block;"><b>Crops:</b></label><input type="text" name="crops" readonly data-mini="true" value="'+results.rows.item(i).crops+ '"style="color:#0033FF;"/></p>' + 
                           '<p><label style="width:12em; display:inline-block;"><b>Livestocks:</b></label><input type="text" name="livestock" readonly data-mini="true" value="' + results.rows.item(i).livestock + '"style="color:#0033FF;"/></p></li>';         
     }
    $(".appendAgr").html(htmlstring);
    $(".appendAgr").listview().listview('refresh');
}

function saveLocalData(){
    $.mobile.loading('show');
    var listMember = $(".appendMembers li").length; 
        listDeath = $(".appendDeath li").length;
        listAgr = $(".appendAgr li").length;
        formData = $("#savedRecordForm").serialize()+"&numMember="+listMember+"&numDeath="+listDeath+"&numAgr="+listAgr+"&enumeratorID="+window.localStorage.getItem("userID");   
    
    $.ajax({
       type:'POST',
       url: 'http://192.168.43.180/datacollection/datacollection/saveLocalData',
       data: formData, 
       success: function(response){
                if(response == '1'){
                    navigator.notification.alert('Data Successful Saved','Success','Success');
                    $.mobile.loading('hide');
                    deleteRecords();
                }
                else{
                    navigator.notification.alert('Error uploading information','Error!','Error!');
                    $.mobile.loading('hide');
                    $.mobile.changePage("#queue_viewRecord");
                }        
       }
    });
}
function deleteRecords(){
    db.transaction(recordTodelete,errorCB);
    $.mobile.changePage("#queueRecords");
}

function recordTodelete(tx){
    tx.executeSql('DELETE FROM identity WHERE id=?',[getID]);
    tx.executeSql('DELETE FROM member WHERE familyID=?',[getID]);
    tx.executeSql('DELETE FROM death WHERE familyID=?',[getID]);
}

