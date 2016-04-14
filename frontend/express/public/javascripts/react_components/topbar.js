var TopBar = React.createClass({

    getInitialState: function() {

        return {
            fstmenu : false,
            sndmenu : jQuery.i18n.map["sidebar.dashboard"],
            user_menu_open : false,
            language_menu_open : false,
            language : this.props.language
        };
    },

    componentWillReceiveProps : function(nextProps) {

        var first = false;
        var second = false;

        for (var i = 0; i < navigation.length; i++)
        {

            if (navigation[i].path == nextProps.first){

                first = navigation[i].key;

                for (var j = 0; j < navigation[i].items.length; j++)
                {

                    if (navigation[i].items[j][1].split("/")[2] == nextProps.second)
                    {
                        second = navigation[i].items[j][0];
                        break;
                    }
                }

                break;
            }
        }

        if (!second)
        {
            this.setState({
                fstmenu : false, //nextProps.first,
                sndmenu : first, //nextProps.second,
                language : nextProps.language
            })
        }
        else
        {
            this.setState({
                fstmenu : first, //nextProps.first,
                sndmenu : second, //nextProps.second,
                language : nextProps.language
            })
        }

    },

    handleOpenUserMenu : function(){

        if (this.state.user_menu_open == false)
        {
            var self = this;

            document.onclick = function(event) {

                if(self.clickedOutsideElement(event, 'top_bar'))
                {

                    document.onclick = false;

                    console.log("===== click outside =============");

                    self.setState({
                        user_menu_open : false,
                        language_menu_open : false
                    });
                }
            }
        }

        this.setState({
            user_menu_open : !this.state.user_menu_open,
            language_menu_open : (this.state.language_menu_open && this.state.user_menu_open) ? false : this.state.language_menu_open
        });
    },

    languageMenuState : function(){

        this.setState({
            language_menu_open : !this.state.language_menu_open
        })

    },

    changeLanguage : function(langCode){

        console.log("click change:", langCode);

        var self = this;

        //var langCode = $(this).data("language-code"),

        var langCodeUpper = langCode.toUpperCase();

        store.set("countly_lang", langCode);
        console.log("global cdn:", countlyGlobal["cdn"]);
        //$(".reveal-language-menu").text(langCodeUpper);

        countlyCommon.BROWSER_LANG_SHORT = langCode;
        countlyCommon.BROWSER_LANG = langCode;

        try {
            moment.lang(countlyCommon.BROWSER_LANG_SHORT);
        } catch(e) {
            moment.lang("en");
        }
/*
        $("#date-to").datepicker("option", $.datepicker.regional[countlyCommon.BROWSER_LANG]);
        $("#date-from").datepicker("option", $.datepicker.regional[countlyCommon.BROWSER_LANG]);
        */
        $.ajax({
            type:"POST",
            url:countlyGlobal["path"]+"/user/settings/lang",
            data:{
                "username":countlyGlobal["member"].username,
                "lang":countlyCommon.BROWSER_LANG_SHORT,
                _csrf:countlyGlobal['csrf_token']
            },
            success:function (result) {}
        });

        jQuery.i18n.properties({
            name:'locale',
            cache:true,
            language:countlyCommon.BROWSER_LANG_SHORT,
            path:[countlyGlobal["cdn"]+'/localization/min/'], 
            mode:'map',
            callback:function () {
                self.origLang = JSON.stringify(jQuery.i18n.map);
                $.when(countlyLocation.changeLanguage()).then(function () {

                    console.log("========= jQuery.i18n done =====");
                    console.log(jQuery.i18n.map);
                    
                    _.defer(function(){
                        self.props.on_change_language(langCode);
                    })                    

                    self.setState({
                        user_menu_open : false,
                        language_menu_open : false
                    })

                    /*self.activeView.render();
                    self.pageScript();*/
                });
            }
        });

    },

    render : function() {

        if (this.state.fstmenu)
        {
            var arrow_block = <div className="arrow_icon"></div>;
        }
        else
        {
            var arrow_block = "";
        }

        var sndmenu_class = "sndmenu";

        if (!this.state.fstmenu)
        {
            sndmenu_class += " dashboard";
        }

        var block_style = {
            "width" : this.props.width + "px"
        }

        var user_menu_style = {};

        var language_menu_style = {};

        if (this.state.user_menu_open){
            user_menu_style.display = "block"
        }

        if (this.state.language_menu_open){
            user_menu_style["border-top-left-radius"] = "0px";
            user_menu_style["border-bottom-left-radius"] = "0px";
            language_menu_style.display = "block";
            var language_menu_select_class = "active";
        }
        else
        {
            var language_menu_select_class = "";
        }

        // <div className="hint_icon"></div>

        return (
              <div className="navigation" style={block_style}>
                  <span className="fstmenu">{this.state.fstmenu}</span>
                  {arrow_block}
                  <span className={sndmenu_class}>{this.state.sndmenu}</span>
                  

                  <div className="user_name_block" onClick={this.handleOpenUserMenu}><span className="name">{this.props.user_name}</span><span className="arrow"></span></div>
                  <div className="user_menu" style={user_menu_style}>

                      <div className="top_arrow"></div>

                      <span>{jQuery.i18n.map["sidebar.settings"]}</span>
                      <span>{jQuery.i18n.map["user-settings.api-key"]}</span>
                      <span onClick={this.languageMenuState} className={language_menu_select_class}><span className="arrow"></span>Language</span>
                      <span className="logout">{jQuery.i18n.map["sidebar.logout"]}</span>
                  </div>

                  <div className="language_menu" style={language_menu_style}>
                      <div className="group">
                        <div onClick={this.changeLanguage.bind(this, "de")} className={(countlyCommon.BROWSER_LANG_SHORT == "de") ? "item active" : "item"}><img src="/images/flags/de.png"/>Deutsch</div>
                        <div onClick={this.changeLanguage.bind(this, "en")} className={(countlyCommon.BROWSER_LANG_SHORT == "en") ? "item active" : "item"}><img src="/images/flags/gb.png"/>English</div>
                        <div onClick={this.changeLanguage.bind(this, "es")} className={(countlyCommon.BROWSER_LANG_SHORT == "es") ? "item active" : "item"}><img src="/images/flags/es.png"/>Español</div>
                        <div onClick={this.changeLanguage.bind(this, "fr")} className={(countlyCommon.BROWSER_LANG_SHORT == "fr") ? "item active" : "item"}><img src="/images/flags/fr.png"/>Français</div>
                        <div onClick={this.changeLanguage.bind(this, "it")} className={(countlyCommon.BROWSER_LANG_SHORT == "it") ? "item active" : "item"}><img src="/images/flags/it.png"/>Italiano</div>
                        <div onClick={this.changeLanguage.bind(this, "nl")} className={(countlyCommon.BROWSER_LANG_SHORT == "nl") ? "item active" : "item"}><img src="/images/flags/nl.png"/>Nederlands</div>
                        <div onClick={this.changeLanguage.bind(this, "lv")} className={(countlyCommon.BROWSER_LANG_SHORT == "lv") ? "item active" : "item"}><img src="/images/flags/lv.png"/>Latviski</div>
                      </div>
                      <div className="group">
                        <div onClick={this.changeLanguage.bind(this, "et")} className={(countlyCommon.BROWSER_LANG_SHORT == "et") ? "item active" : "item"}><img src="/images/flags/et.png"/>Eesti</div>
                        <div onClick={this.changeLanguage.bind(this, "pt")} className={(countlyCommon.BROWSER_LANG_SHORT == "pt") ? "item active" : "item"}><img src="/images/flags/pt.png"/>Português</div>
                        <div onClick={this.changeLanguage.bind(this, "ru")} className={(countlyCommon.BROWSER_LANG_SHORT == "ru") ? "item active" : "item"}><img src="/images/flags/ru.png"/>Русский язык</div>
                        <div onClick={this.changeLanguage.bind(this, "tr")} className={(countlyCommon.BROWSER_LANG_SHORT == "tr") ? "item active" : "item"}><img src="/images/flags/tr.png"/>Türkçe</div>
                        <div onClick={this.changeLanguage.bind(this, "zh")} className={(countlyCommon.BROWSER_LANG_SHORT == "zh") ? "item active" : "item"}><img src="/images/flags/ch.png"/>中文</div>
                        <div onClick={this.changeLanguage.bind(this, "ja")} className={(countlyCommon.BROWSER_LANG_SHORT == "ja") ? "item active" : "item"}><img src="/images/flags/jp.png"/>日本語</div>
                        <div onClick={this.changeLanguage.bind(this, "ko")} className={(countlyCommon.BROWSER_LANG_SHORT == "ko") ? "item active" : "item"}><img src="/images/flags/kr.png"/>한국어</div>
                      </div>
                  </div>

              </div>
        );
    },

    clickedOutsideElement : function(event, elemId) {

        if (!event)
        {
            return false;
        }

        var theElem = this.getEventTarget(event);
        while(theElem != null) {
          if(theElem.id == elemId)
            return false;
          theElem = theElem.offsetParent;
        }
        return true;
    },

    getEventTarget : function(evt) {
        var targ = (evt.target) ? evt.target : evt.srcElement;
        if(targ != null) {
          if(targ.nodeType == 3)
            targ = targ.parentNode;
        }
        return targ;
    },
});
