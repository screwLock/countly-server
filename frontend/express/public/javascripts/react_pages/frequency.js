var FrequencyPage = React.createClass({

    mixins: [UpdatePageMixin, UnmounCheckMixin],

    getInitialState: function() {

        var headers = [{
            "title":jQuery.i18n.map["session-frequency.table.time-after"], // todo : not common.total-sessions
            "short" : "f",
        },
        {
            "title":jQuery.i18n.map["common.number-of-users"],
            "short" : "t"
        },
        {
            "title":jQuery.i18n.map["common.percent"],
            "short" : "percent"
        }]

        var sort_functions = {
            "t" : math_sort,
            "f" : math_sort,
            "percent" : math_sort
        }

        return({
            sort_functions : sort_functions,
            headers : headers,
            inited : false,
            active_app : this.props.active_app
        });

    },

    init_data : function(timestamp) {

        var self = this;

        $.when(countlyUser.initialize()).then(function () {

            if (self.isUnmounted){                
                return false;
            }

            self.setState({
                inited : true,
            })

        });
    },
    
    componentWillReceiveProps : function(nextProps) {
                       
        if (nextProps.active_app != this.state.active_app) // active app changed
        {                                               
            this.setState({
                active_app : nextProps.active_app,
                inited : false
            });
            
            var data_timestamp = Math.floor(Date.now());

            this.init_data(data_timestamp);            
        }    
    },

    render : function(){

        if (!this.state.inited)
        {
            return (<Loader/>);
        }

        var elements_width = get_viewport_width();
        var chart_height = 300;

        var page_style = {
            "width" : elements_width
        }

        return (
            <div className="page" style={page_style}>

                <Chart headline_sign={"SESSION FREQUENCY"}
                    headers={this.state.headers}
                    width={elements_width}
                    height={chart_height}
                    side_margin={30}
                    bar_width={40}
                    data_function={countlyUser.getFrequencyData}
                    tooltip_width={60}
                    tooltip_height={44}
                    bar_width={40}
                    date={this.props.date}
                />

                <SortTable
                    headers={this.state.headers}
                    width={elements_width}
                    row_height={50}
                    data_sign={"DATA"}
                    sort_functions={this.state.sort_functions}
                    data_function={countlyUser.getFrequencyData}
                    convert_data_function={false}
                    initial_sort={"frequency"}
                    rows_per_page={20}
                    date={this.props.date}
                />
          </div>)
    }
})
