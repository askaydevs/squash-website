import React from 'react';
import {
    Badge,
    Container,
    Col,
    Row,
    Button,
    Form,
    Input,
    Card
} from 'reactstrap';
import SquashForest from './forest.js';
import RequestForm from './request_form.js';
import SERVER_URL from './url.js';


class SquashDemo extends React.Component {
    constructor(props) {
        super(props);
        const urlParams = new URLSearchParams(window.location.search);
        const squashId = urlParams.get('id');
        this.state = {
            squashId: squashId,
            settings: {
                'top_p': 0.9,
                'gen_frac': 0.5,
                'spec_frac': 0.8
            },
            forest: null
        };
    }

    buildInputString(squash_data) {
        var elements = squash_data.qa_tree.map((para) => {return para.para_text});
        return elements.join('\n\n');
    }

    componentDidMount() {
        if (this.state.squashId) {
            var url = SERVER_URL + "/get_squash?id=" + this.state.squashId

            fetch(url).then(res => res.json()).then((result) => {
                document.getElementById("squashInputText").value = this.buildInputString(result.squash_data)
                this.setState({
                    forest: result.squash_data
                });

            }, (error) => {
                console.log(error)
            })
        }
    }

    changeSlider(e, type) {
        var new_settings = this.state.settings;
        new_settings[type] = e.target.value;
        this.setState({settings: new_settings});
    }

    squashDoc() {
        var url = SERVER_URL + "/request_squash";
        var flags = {
            method: 'POST',
            body: JSON.stringify({
                settings: this.state.settings,
                input_text: document.getElementById('squashInputText').value
            })
        };
        fetch(url, flags).then(res => res.json()).then((result) => {
            window.location.href = '/?id=' + result.new_id;
        }, (error) => {
            console.log(error);
        })
    }

    render() {
        var squash_loaded = false;
        if (this.state.forest != null) {
            squash_loaded = true;
        }
        return (
            <div className="container-fluid">
                <Row>
                    <Col xs="5">
                    <RequestForm
                        forest={this.state.forest}
                        settings={this.state.settings}
                        changeSliderTopP={(e) => this.changeSlider(e, 'top_p')}
                        changeSliderGenFrac={(e) => this.changeSlider(e, 'gen_frac')}
                        changeSliderSpecFrac={(e) => this.changeSlider(e, 'spec_frac')}
                        squashDoc={() => this.squashDoc()}
                    />
                    </Col>
                    <Col xs="7">
                        {squash_loaded && <SquashForest forest={this.state.forest}/>}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default SquashDemo;