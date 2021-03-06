import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,Panel,ListGroup,ListGroupItem,PanelGroup } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

import { get_engine_initial_offset,set_engine_filter} from './../Engine/ListEngines';
import { get_game_pictures_initial_offset,set_game_pictures_filter } from './../Engine/EditEngine';
import { get_system_initial_offset,set_system_filter } from './../System/ListSystems';
import { get_engine_configuration_initial_offset,set_engine_configuration_filter } from './../Engine_configuration/ListEngine_configurations';

import { get_tag_initial_offset,set_tag_filter } from './../Tag/ListTags';
import { get_tag_category_initial_offset,set_tag_category_name_filter,set_tag_category_description_filter } from './../Tag_category/ListTag_categorys';
import { get_game_initial_offset,set_game_filter } from './../Game/ListGames';

function clear_engine_filter() {
  set_engine_filter('');
  set_game_pictures_filter('');
}

function clear_system_filter() {
  set_system_filter('');
}

function clear_engine_configuration_filter() {
  set_engine_configuration_filter('');
}

function clear_tag_filter() {
  set_tag_filter('');
}

function clear_tag_category_filter() {
  set_tag_category_name_filter('');
  set_tag_category_description_filter('');
}

function clear_game_filter() {
  set_game_filter('');
}

export default React.createClass({
  getInitialState() {
    return {
      activeKey: '1'
    };
  },
  handleSelect(activeKey) {
    this.setState({ activeKey });
  },
  render: function() {
    return (
      <div className="app">
        <PanelGroup activeKey={this.state.activeKey} onSelect={this.handleSelect} accordion>
          <Panel header="Game" eventKey="1">
            <ListGroup fill>
              <ListGroupItem><Link onClick={clear_game_filter} to={sprintf('/ListGames/%s',get_game_initial_offset())}>Game</Link></ListGroupItem>
            </ListGroup>
          </Panel>
          <Panel header="Runtime" eventKey="4">
            <ListGroup fill>
              <ListGroupItem><Link onClick={clear_system_filter} to={sprintf('/ListSystems/%s',get_system_initial_offset())}>System</Link></ListGroupItem>
              <ListGroupItem><Link onClick={clear_engine_filter} to={sprintf('/ListEngines/%s',get_engine_initial_offset())}>Engine</Link></ListGroupItem>
              <ListGroupItem><Link onClick={clear_engine_configuration_filter} to={sprintf('/ListEngine_configurations/%s',get_engine_configuration_initial_offset())}>Engine configuration</Link></ListGroupItem>
            </ListGroup>
          </Panel>
          <Panel header="Meta Data" eventKey="2">
            <ListGroup fill>
              <ListGroupItem><Link onClick={clear_tag_filter} to={sprintf('/ListTags/%s',get_tag_initial_offset())}>Tag</Link></ListGroupItem>
              <ListGroupItem><Link onClick={clear_tag_category_filter} to={sprintf('/ListTag_categorys/%s',get_tag_category_initial_offset())}>Tag category</Link></ListGroupItem>
              <ListGroupItem><Link to={'/ListOrganisations/1'}>Organisation</Link></ListGroupItem>
            </ListGroup>
          </Panel>
          <Panel header="Media" eventKey="6">
            <ListGroup fill>
              <ListGroupItem><Link to={'/ListPictures/1'}>Pictures</Link></ListGroupItem>
              <ListGroupItem><Link to={'/ListLinks/1'}>Links</Link></ListGroupItem>
              <ListGroupItem><Link to={'/ListFiles/1'}>Files</Link></ListGroupItem>
            </ListGroup>
          </Panel>
        </PanelGroup>
      </div>
    );
  }
});
