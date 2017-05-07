import React from 'react';
import {render} from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'

import Layout from './Layout/Layout'
import Data from './Layout/Data'

import AddEngine from './Engine/AddEngine'
import EditEngine from './Engine/EditEngine'
import ListEngines from './Engine/ListEngines'

import AddSystem from './System/AddSystem'
import EditSystem from './System/EditSystem'
import ListSystems from './System/ListSystems'

import AddEngine_configuration from './Engine_configuration/AddEngine_configuration'
import EditEngine_configuration from './Engine_configuration/EditEngine_configuration'
import ListEngine_configurations from './Engine_configuration/ListEngine_configurations'

import AddOrganisation from './Organisation/AddOrganisation'
import EditOrganisation from './Organisation/EditOrganisation'
import ListOrganisations from './Organisation/ListOrganisations'

import AddPicture from './Picture/AddPicture'
import EditPicture from './Picture/EditPicture'
import ListPictures from './Picture/ListPictures'

import AddLink from './Link/AddLink'
import EditLink from './Link/EditLink'
import ListLinks from './Link/ListLinks'

import AddFile from './File/AddFile'
import EditFile from './File/EditFile'
import ListFiles from './File/ListFiles'

import AddTag from './Tag/AddTag'
import EditTag from './Tag/EditTag'
import ListTags from './Tag/ListTags'

import AddTag_category from './Tag_category/AddTag_category'
import EditTag_category from './Tag_category/EditTag_category'
import ListTag_categorys from './Tag_category/ListTag_categorys'

import AddGame_file from './Game_file/AddGame_file'
import EditGame_file from './Game_file/EditGame_file'
import ListGame_files from './Game_file/ListGame_files'

import AddEngine_file from './Engine_file/AddEngine_file'
import EditEngine_file from './Engine_file/EditEngine_file'
import ListEngine_files from './Engine_file/ListEngine_files'

import AddGame from './Game/AddGame'
import EditGame from './Game/EditGame'
import ListGames from './Game/ListGames'

render((
  <Router history={hashHistory}>
    <Route path ="/" component={Layout}>
      <Route path="/ListEngines/:offset" component={ListEngines}/>
      <Route path="/AddEngine" component={AddEngine}/>
      <Route path="/EditEngine/:id" component={EditEngine}/>

      <Route path="/ListSystems/:offset" component={ListSystems}/>
      <Route path="/AddSystem" component={AddSystem}/>
      <Route path="/EditSystem/:id" component={EditSystem}/>

      <Route path="/ListEngine_configurations/:offset" component={ListEngine_configurations}/>
      <Route path="/AddEngine_configuration" component={AddEngine_configuration}/>
      <Route path="/EditEngine_configuration/:id" component={EditEngine_configuration}/>

      <Route path="/ListOrganisations/:reload" component={ListOrganisations}/>
      <Route path="/AddOrganisation" component={AddOrganisation}/>
      <Route path="/EditOrganisation/:uid" component={EditOrganisation}/>

      <Route path="/ListPictures/:reload" component={ListPictures}/>
      <Route path="/AddPicture" component={AddPicture}/>
      <Route path="/EditPicture/:uid" component={EditPicture}/>

      <Route path="/ListLinks/:reload" component={ListLinks}/>
      <Route path="/AddLink" component={AddLink}/>
      <Route path="/EditLink/:uid" component={EditLink}/>

      <Route path="/ListFiles/:reload" component={ListFiles}/>
      <Route path="/AddFile" component={AddFile}/>
      <Route path="/EditFile/:uid" component={EditFile}/>

      <Route path="/ListTags/:offset" component={ListTags}/>
      <Route path="/AddTag" component={AddTag}/>
      <Route path="/EditTag/:id" component={EditTag}/>

      <Route path="/ListTag_categorys/:offset" component={ListTag_categorys}/>
      <Route path="/AddTag_category" component={AddTag_category}/>
      <Route path="/EditTag_category/:id" component={EditTag_category}/>

      <Route path="/ListGame_files/:offset" component={ListGame_files}/>
      <Route path="/AddGame_file" component={AddGame_file}/>
      <Route path="/EditGame_file/:id" component={EditGame_file}/>

      <Route path="/ListEngine_files/:offset" component={ListEngine_files}/>
      <Route path="/AddEngine_file" component={AddEngine_file}/>
      <Route path="/EditEngine_file/:id" component={EditEngine_file}/>

      <Route path="/ListGames/:offset" component={ListGames}/>
      <Route path="/AddGame" component={AddGame}/>
      <Route path="/EditGame/:id" component={EditGame}/>
    </Route>
  </Router>
), document.getElementById('app'))
