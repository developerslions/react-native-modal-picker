'use strict';

import React, {
    View,
    StyleSheet,
    Dimensions,
    Modal,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform,
    PropTypes
} from 'react-native';

import styles from './style';
import BaseComponent from './BaseComponent';
import rebound from 'rebound';

let tag;
const Portal = require('react-native/Libraries/Portal/Portal.js');

const propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    initValue: PropTypes.string,
    style: View.propTypes.style,
    selectStyle: View.propTypes.style,
    optionStyle: View.propTypes.style,
    optionTextStyle: View.propTypes.style,
    sectionStyle: View.propTypes.style,
    sectionTextStyle: View.propTypes.style,
    cancelStyle: View.propTypes.style,
    cancelTextStyle: View.propTypes.style,
    overlayStyle: View.propTypes.style,
    cancelText: PropTypes.string
}

const defaultProps = {
    data: [],
    onChange: ()=> {},
    initValue: 'Select me!',
    style: {},
    selectStyle: {},
    optionStyle: {},
    optionTextStyle: {},
    sectionStyle: {},
    sectionTextStyle: {},
    cancelStyle: {},
    cancelTextStyle: {},
    overlayStyle: {},
    cancelText: 'cancel'
}

export default class ModalPicker extends BaseComponent {

    constructor() {

        super();

        this._bind(
            'onChange',
            'open',
            'close',
            'renderChildren'
        );

        this.state = {
            animated: true,
            modalVisible: false,
            transparent: false,
            selected: 'please select',
        };
    }

    componentDidMount() {
        this.setState({selected: this.props.initValue});
        this.setState({cancelText: this.props.cancelText});
    }

    onChange(item) {
        this.props.onChange(item);
        this.setState({selected: item.label});
        this.close();
    }

    close() {
        this.setState({
            modalVisible: false
        });
    }

    open() {
        this.setState({
            modalVisible: true
        });
    }

    renderSection(section) {
        return (
            <View key={section.key} style={[styles.sectionStyle,this.props.sectionStyle]}>
                <Text style={[styles.sectionTextStyle,this.props.sectionTextStyle]}>{section.label}</Text>
            </View>
        );
    }

    renderOption(option) {
        return (
            <TouchableOpacity key={option.key} onPress={()=>this.onChange(option)}>
                <View style={[styles.optionStyle, this.props.optionStyle]}>
                    <Text style={[styles.optionTextStyle,this.props.optionTextStyle]}>{option.label}</Text>
                </View>
            </TouchableOpacity>)
    }

    renderOptionList() {
        var options = this.props.data.map((item) => {
            if (item.section) {
                return this.renderSection(item);
            } else {
                return this.renderOption(item);
            }
        });

        return (
            <View style={[styles.overlayStyle, this.props.overlayStyle]}>
                <View style={styles.optionContainer}>
                    <ScrollView keyboardShouldPersistTaps>
                        <View style={{paddingHorizontal:10}}>
                            {options}
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.cancelContainer}>
                    <TouchableOpacity onPress={this.close}>
                        <View style={[styles.cancelStyle, this.props.cancelStyle]}>
                            <Text style={[styles.cancelTextStyle,this.props.cancelTextStyle]}>{this.props.cancelText}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>);
    }

    renderChildren() {
        if(this.props.children) {
            return this.props.children;
        }
        return (
            <View style={[styles.selectStyle, this.props.selectStyle]}>
                <Text style={[styles.selectTextStyle, this.props.selectTextStyle]}>{this.state.selected}</Text>
            </View>
        );
    }


    render() {
        return (
            <View style={this.props.style}>
                <Modal transparent={true} ref="modal" visible={this.state.modalVisible} animated={this.state.animated}>
                    {this.renderOptionList()}
                </Modal>
                <TouchableOpacity onPress={this.open}>
                    {this.renderChildren()}
                </TouchableOpacity>
            </View>
        );
    }
}

ModalPicker.propTypes = propTypes;
ModalPicker.defaultProps = defaultProps;
