import { get_tag_initial_offset,set_tag_filter } from './../Tag/ListTags';


function clear_tag_filter() {
  set_tag_filter('');
}


          <Button><Link onClick={clear_tag_filter} to={sprintf('/ListTags/%s',get_tag_initial_offset())}>Tag</Link></Button>
