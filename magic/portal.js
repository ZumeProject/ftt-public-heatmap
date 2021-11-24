var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
  || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
  isMobile = true;
}

jQuery(document).ready(function() {
  window.new_inc = 0

  if ( 'list' === jsObject.parts.action ) {
    window.load_tree()
  } else if ( 'profile' === jsObject.parts.action ) {
    window.load_profile()
  }
});

/**
 * List Section
 */
window.post_item = ( action, data ) => {
  return jQuery.ajax({
    type: "POST",
    data: JSON.stringify({ action: action, parts: jsObject.parts, data: data }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    url: jsObject.root + jsObject.parts.root + '/v1/' + jsObject.parts.type,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('X-WP-Nonce', jsObject.nonce )
    }
  })
    .fail(function(e) {
      console.log(e)
      jQuery('#error').html(e)
      jQuery('.loading-spinner').removeClass('active')
    })
}

window.load_tree = () => {
  jQuery.ajax({
    type: "POST",
    data: JSON.stringify({ action: 'POST', parts: jsObject.parts }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    url: jsObject.root + jsObject.parts.root + '/v1/' + jsObject.parts.type,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('X-WP-Nonce', jsObject.nonce )
    }
  })
    .done(function(data){
      console.log(data)

      window.load_domenu(data)

      jQuery('.loading-spinner').removeClass('active')
      jQuery('#initial-loading-spinner').hide()
    })
    .fail(function(e) {
      console.log(e)
      jQuery('#error').html(e)
      jQuery('.loading-spinner').removeClass('active')
    })
}

window.load_domenu = ( data ) => {

  jQuery('#domenu-0').domenu({
    data: JSON.stringify( data.tree ),
    maxDepth: 500,
    refuseConfirmDelay: 500, // does not delete immediately but requires a second click to confirm.
    select2:                {
      support:     false, // Enable Select2 support
    }
  }).parseJson()

    .onCreateItem(function(e) {
      console.log('onCreateItem')

      window.new_inc++

      window.new_item = {
        inc: window.new_inc,
        temp_id: 'new_id_'+window.new_inc,
        parent_id: 'domenu-0'
      }

      e.attr('id', 'new_id_'+window.new_inc )
    })
    .onItemAddChildItem(function(e) {
      console.log('onItemAddChildItem')
      console.log( e[0].id )
      window.new_item.parent_id = e[0].id
    })
    .onItemRemoved(function(e) {
      if ( window.last_removed !== e[0].id ) {
        console.log('onItemRemoved')
        jQuery('.loading-spinner').addClass('active')

        window.last_removed = e[0].id

        window.post_item('onItemRemoved', { id: e[0].id} ).done(function(remove_data){
          if ( remove_data ) {
            console.log('success onItemRemoved')
          }
          else {
            console.log('did not remove item')
          }
          jQuery('.loading-spinner').removeClass('active')
        })
      }
    })
    .onItemDrop(function(e) {
      if ( typeof e.prevObject !== 'undefined' && typeof e[0].id !== 'undefined' ) { // runs twice on drop. with and without prevObject
        console.log('onItemDrop')
        jQuery('.loading-spinner').addClass('active')

        let new_parent = e[0].parentNode.parentNode.id
        let self = e[0].id

        console.log(' - new parent: '+ new_parent)
        console.log(' - self: '+ self)

        let prev_parent_object = jQuery('#'+e[0].id)
        let previous_parent = prev_parent_object.data('prev_parent')
        console.log(' - previous parent: ' + previous_parent )

        prev_parent_object.attr('data-prev_parent', new_parent ) // set previous

        if ( new_parent !== previous_parent ) {
          window.post_item('onItemDrop', { new_parent: new_parent, self: self, previous_parent: previous_parent } ).done(function(drop_data){
            jQuery('.loading-spinner').removeClass('active')
            if ( drop_data ) {
              console.log('success onItemDrop')
            }
            else {
              console.log('did not edit item')
            }
          })
        }

      }
    })
    .onItemSetParent(function(e) {
      if (typeof e[0] !== 'undefined' ) {
        console.log('onItemSetParent')
        console.log(' - has children: ' + e[0].id)
        jQuery('#' + e[0].id + ' button.item-remove:first').hide();
      }
    })
    .onItemUnsetParent(function(e) {
      if (typeof e[0] !== 'undefined' ) {
        console.log('onItemUnsetParent')
        console.log(' - has no children: '+ e[0].id)
        jQuery('#' + e[0].id + ' button.item-remove:first').show();
      }
    })


  // list prep
  jQuery.each( jQuery('#domenu-0 .item-name'), function(i,v){
    // move and set the title to id
    jQuery(this).parent().parent().attr('id', jQuery(this).html())
  })
  // set the previous parent data element
  jQuery.each( data.parent_list, function(ii,vv) {
    if ( vv !== null && vv !== "undefined") {
      let target = jQuery('#'+ii)
      if ( target.length > 0 ) {
        target.attr('data-prev_parent', vv )
      }
    }
  })
  // show delete for last item
  jQuery("li:not(:has(>ol)) .item-remove").show()
  // set title
  jQuery.each(jQuery('.item-name'), function(ix,vx) {
    let old_title = jQuery(this).html()
    jQuery(this).html(data.title_list[old_title])
  })
  // add listener to top add item box
  jQuery('.dd-new-item').on('click', function() {
    window.create_group()
  })
  // set listener for add submenu items
  jQuery('#domenu-0 .item-add').on('click', function(e) {
    window.create_group()
  })
  // set listener for edit button
  jQuery('#domenu-0 .item-edit').on('click', function(e) {
    window.open_modal(e.currentTarget.parentNode.parentNode.parentNode.id)
  })
}

window.create_group = () => {
  console.log('create_group')
  jQuery('.loading-spinner').addClass('active')
  window.open_empty_modal()

  console.log( window.new_item )

  window.post_item('create_group', window.new_item )
    .done(function(response){
      console.log(response)
      if ( response ) {

        jQuery('#'+ response.temp_id).attr('id', response.id )
        jQuery('#'+response.id).attr('data-prev_parent', response.prev_parent )
        jQuery('#'+response.id + ' .item-name:first').html( response.title )
        jQuery('#'+response.id + ' .item-add:first').on('click', function(e) {
          window.create_group()
        })
        jQuery('#'+response.id + ' .item-edit:first').on('click', function(e) {
          window.open_modal(response.id )
        })

        response.post.title = ""
        response.post.name = ""
        window.load_modal_content( response.post, response.post_fields )

      } else {
        console.log(response)
      }

    })
}

window.create_group_by_map = ( ) => {
  console.log('create_group')
  jQuery('.loading-spinner').addClass('active')
  window.open_empty_modal()

  let title = jQuery('#report-modal-title').val()
  let grid_id = jQuery('#report-grid-id').val()

  window.new_inc++

  window.new_item = {
    inc:  window.new_inc,
    grid_id: grid_id,
    title: title
  }

  window.post_item('create_group_by_map', { inc:  window.new_inc, grid_id: grid_id, title: title } )
    .done(function(response){
      console.log(response)
      if ( response ) {

        // reload mapdata when new church is added
        window.get_grid_data( 'grid_data', 0)
          .done(function(x){
            console.log('updated grid_data')
            jsObject.grid_data = x
          })

        response.post.title = ""
        response.post.name = ""
        jsObject.custom_marks = response.custom_marks
        window.load_modal_content( response.post, response.post_fields )

      } else {
        console.log(response)
      }

    })
}

window.open_empty_modal= () => {
  let title = jQuery('#modal-title')
  let content = jQuery('#modal-content')

  title.empty().html(`<span class="loading-spinner active"></span>`)
  content.empty()
  jQuery('#edit-modal').foundation('open')
}


jQuery('.float').on('click', function(){
  window.open_create_modal()
})

window.open_modal = ( id ) => {
  let title = jQuery('#modal-title')
  let content = jQuery('#modal-content')

  title.empty().html(`<span class="loading-spinner active"></span>`)
  content.empty()

  jQuery('#edit-modal').foundation('open')

  window.post_item('get_group', { id: id } )
    .done(function(response){
      console.log(response)
      if ( typeof response.errors === 'undefined' ) {
        window.load_modal_content( response.post, response.post_fields )
      } else {
        console.log(response)
        jQuery('.loading-spinner').removeClass('active')
      }
    })
}

window.load_modal_content = ( post, post_fields ) => {
  let member_count = 0
  if ( typeof post.member_count !== 'undefined' ) {
    member_count = post.member_count
  }

  let start_date = ''
  if ( typeof post.church_start_date !== 'undefined' ) {
    start_date = post.church_start_date.formatted
  }

  let type_select
  let selected = 'church'
  if ( typeof post.group_type !== "undefined" ) {
    selected = post.group_type.key
  }
  jQuery.each( post_fields.group_type.default, function( i, v ) {
    let preselect = ''
    if ( i === selected ) {
      preselect = ' selected'
    }
    type_select += '<option value="'+i+'" '+preselect+'>'+v.label+'</option>'
  })

  let status_select
  let status_selected = 'active'
  if ( typeof post.group_status !== "undefined" ) {
    status_selected = post.group_status.key
  }
  jQuery.each( post_fields.group_status.default, function( i, v ) {
    let preselect_s = ''
    if ( i === status_selected ) {
      preselect_s = ' selected'
    }
    status_select += '<option value="'+i+'" '+preselect_s+'>'+v.label+'</option>'
  })

  // template
  jQuery('#modal-title').html('<h1>Edit Church</h1><hr>')
  jQuery('#modal-content').append(`
          <div class="grid-x">

            <!-- title -->
            <div class="cell">
              Name <span style="color:red;">*</span><br>
              <div class="input-group">
                <input type="text" style="border:0; border-bottom: 1px solid darkgrey;font-size:1.5rem;line-height: 2rem;" id="group_title" placeholder="${post.name}" value="${post.title}" autofocus />
                <div class="input-group-button">
                     <div><span class="loading-field-spinner group_title"></span></div>
                </div>
              </div>
            </div>

            <!-- start date -->
            <div class="cell">
              Start Date<br>
              <div class="input-group">
                <input type="date" style="border:0; border-bottom: 1px solid darkgrey;font-size:1.5rem;line-height: 2rem;" id="group_start_date" value="${start_date}" />
                <div class="input-group-button">
                     <div><span class="loading-field-spinner group_start_date"></span></div>
                </div>
              </div>
            </div>

            <!-- members -->
            <div class="cell">
              Number of Members<br>
              <div class="input-group">
                <input type="number" style="border:0; border-bottom: 1px solid darkgrey;font-size:1.5rem;line-height: 2rem;" id="group_member_count" value="${member_count}" />
                <div class="input-group-button">
                     <div><span class="loading-field-spinner group_member_count"></span></div>
                </div>
              </div>
            </div>

            <!-- location -->
            <div class="cell" id="mapbox-select">
              Location<br>
              <div id="map-wrapper-edit">
                  <div id='map-edit'></div>
              </div>
              <br>
              <button type="button" onclick="remove_location(${post.ID})" style="display:none;" class="button primary-button-hollow remove-location">Remove Location</button>
              <span class="loading-field-spinner group_location"></span>
            </div>

            <!-- status -->
            <div class="cell">
              Status<br>
              <div class="input-group">
                <select id="group_status">
                  ${status_select}
                </select>
                <div class="input-group-button">
                     <div><span class="loading-field-spinner group_status"></span></div>
                </div>
              </div>
            </div>
          </div>
        `)

  // listeners
  jQuery('#group_title').on('change', function(e){
    jQuery('.loading-field-spinner.group_title').addClass('active')
    window.post_item('update_group_title', { post_id: post.ID, new_value: e.target.value } )
      .done(function(result) {
        console.log(result)
        if ( typeof result.errors === 'undefined') {
          jQuery('#group_title').attr('value', result.name)
          jQuery('#'+post.ID + ' .item-name:first').html(result.name)
        }
        else {
          console.log(result)
        }
        jQuery('.loading-field-spinner.group_title').removeClass('active')
      })
  })
  jQuery('#group_member_count').on('change', function(e){
    jQuery('.loading-field-spinner.group_member_count').addClass('active')
    window.post_item('update_group_member_count', { post_id: post.ID, new_value: e.target.value } )
      .done(function(result) {
        console.log(result)
        if ( typeof result.errors === 'undefined') {
          jQuery('#group_member_count').attr('value', result.member_count)
        }
        else {
          console.log(result)
        }
        jQuery('.loading-field-spinner.group_member_count').removeClass('active')
      })
  })
  jQuery('#group_start_date').on('change', function(e){
    jQuery('.loading-field-spinner.group_start_date').addClass('active')
    window.post_item('update_group_start_date', { post_id: post.ID, new_value: e.target.value } )
      .done(function(result) {
        console.log(result)
        if ( typeof result.errors !== 'undefined') {
          console.log(result)
        }
        jQuery('.loading-field-spinner.group_start_date').removeClass('active')
      })
  })
  jQuery('#group_status').on('change', function(e){
    jQuery('.loading-field-spinner.group_status').addClass('active')
    window.post_item('update_group_status', { post_id: post.ID, new_value: e.target.value } )
      .done(function(result) {
        console.log(result)
        if ( typeof result.errors !== 'undefined') {
          console.log(result)
        }
        jQuery('.loading-field-spinner.group_status').removeClass('active')
      })
  })
  jQuery(window).on(
    'closed.zf.reveal', function () {
      if ( 'map' === jsObject.parts.action ) {
        load_map()
        jQuery('#offCanvasNestedPush').foundation('close')
      }
    }
  );

  // if on map page, do not show map selection section
  let lng,lat
  if( post.location_grid_meta ) {
    lng = post.location_grid_meta[0].lng
    lat = post.location_grid_meta[0].lat
  }
  load_mapbox(lng, lat, post.ID )


  jQuery('.loading-spinner').removeClass('active')
}

window.load_mapbox = (lng,lat, post_id, post_type = 'groups' ) => {

  let center, zoom
  if ( lng ) {
    center = [lng, lat]
  } else {
    center = [-20, 30]
  }

  /***********************************
   * Map
   ***********************************/
  mapboxgl.accessToken = jsObject.map_key;
  var map = new mapboxgl.Map({
    container: 'map-edit',
    style: 'mapbox://styles/mapbox/light-v10',
    center: center,
    zoom: 1
  });

  window.force_values = false
  if ( lng ) {
    let marker_center = new mapboxgl.LngLat(lng, lat)
    window.active_marker = new mapboxgl.Marker()
      .setLngLat(marker_center)
      .addTo(map);
    map.flyTo({
      center: center,
      zoom: 12,
      bearing: 0,
      speed: 2, // make the flying slow
      curve: 1, // change the speed at which it zooms out
      easing: (t) => t,
      essential: true
    });
    window.force_values = true // wipe out previous location data on the record
    jQuery('.remove-location').show() // show the removal button
  }


  /***********************************
   * Click
   ***********************************/
  map.on('click', function (e) {
    console.log(e)

    let lng = e.lngLat.lng
    let lat = e.lngLat.lat
    window.active_lnglat = [lng,lat]

    // add marker
    if ( window.active_marker ) {
      window.active_marker.remove()
    }
    window.active_marker = new mapboxgl.Marker()
      .setLngLat(e.lngLat )
      .addTo(map);

    jQuery('#result_display').html(`Save Clicked Location`)
    jQuery('.remove-location').hide()

    window.location_data = {
      location_grid_meta: {
        values: [
          {
            lng: lng,
            lat: lat,
            source: 'user'
          }
        ],
        force_values: window.force_values
      }
    }

    save_new_location( post_id, post_type )
  });

  /***********************************
   * Search
   ***********************************/
  var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    types: 'country region district locality neighborhood address place',
    mapboxgl: mapboxgl
  });
  map.addControl(geocoder, 'top-left' );
  geocoder.on('result', function(e) { // respond to search
    console.log(e)
    if ( window.active_marker ) {
      window.active_marker.remove()
    }
    window.active_marker = new mapboxgl.Marker()
      .setLngLat(e.result.center)
      .addTo(map);
    geocoder._removeMarker()

    jQuery('#result_display').html(`Save Searched Location`)
    jQuery('.remove-location').hide()

    window.location_data = {
      location_grid_meta: {
        values: [
          {
            lng: e.result.center[0],
            lat: e.result.center[1],
            level: e.result.place_type[0],
            label: e.result.place_name,
            source: 'user'
          }
        ],
        force_values: window.force_values
      }
    }

    save_new_location( post_id, post_type )
  })

  /***********************************
   * Geolocate Browser
   ***********************************/
  let userGeocode = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    marker: {
      color: 'orange'
    },
    trackUserLocation: false,
    showUserLocation: false
  })
  map.addControl(userGeocode, 'top-left' );
  userGeocode.on('geolocate', function(e) { // respond to search
    console.log(e)
    if ( window.active_marker ) {
      window.active_marker.remove()
    }

    let lat = e.coords.latitude
    let lng = e.coords.longitude

    window.active_lnglat = [lng,lat]
    window.active_marker = new mapboxgl.Marker()
      .setLngLat([lng,lat])
      .addTo(map);

    jQuery('#result_display').html(`Save Current Location`)
    jQuery('.remove-location').hide()

    window.location_data = {
      location_grid_meta: {
        values: [
          {
            lng: lng,
            lat: lat,
            source: 'user'
          }
        ],
        force_values: window.force_values
      }
    }

    save_new_location( post_id, post_type )
  })

  let navControl = new mapboxgl.NavigationControl();
  map.addControl( navControl, 'top-left' );
  map.touchZoomRotate.disableRotation();
  map.dragRotate.disable();

}

function activate_geolocation() {
  jQuery(".mapboxgl-ctrl-geolocate").click();
}

function save_new_location( id, post_type ) {
  if ( typeof window.location_data === undefined || window.location_data === false ) {
    jQuery('#result_display').html(`You haven't selected anything yet. Click, search, or allow auto location.`)
    return;
  }
  jQuery('.loading-field-spinner.group_location').addClass('active')

  console.log(window.location_data)

  if ( 'groups' === post_type ) {
    window.post_item('update_group_location', {
      post_id: id,
      location_data: window.location_data,
      delete: window.force_values
    })
      .done(function (result) {
        console.log(result)
        jQuery('.remove-location').show();
        jQuery('.loading-field-spinner.group_location').removeClass('active')
        window.force_values = true

        // reload flat map
        if (jsObject.parts.action === 'map') {
          window.get_grid_data('grid_data', 0)
            .done(function (x) {
              jsObject.grid_data = x
            })
        }
      })
  } else if ( 'contacts' === post_type ) {
    window.post_profile('update_profile_location', {
      post_id: id,
      location_data: window.location_data,
      delete: window.force_values
    })
      .done(function (result) {
        console.log(result)
        jQuery('.remove-location').show();
        jQuery('.loading-field-spinner.group_location').removeClass('active')
        window.force_values = true

        // reload flat map
        if (jsObject.parts.action === 'map') {
          window.get_grid_data('grid_data', 0)
            .done(function (x) {
              jsObject.grid_data = x
            })
        }
      })
  }
}

function remove_location( id, post_type = 'groups' ) {
  jQuery('.loading-field-spinner.group_location').addClass('active')
  if ( 'groups' === post_type ) {
    window.post_item('delete_group_location', { post_id: id } )
      .done(function(result) {
        console.log(result)
        jQuery('.remove-location').hide();
        jQuery('.loading-field-spinner.group_location').removeClass('active')
        window.load_mapbox()
        window.force_values = false
      })
  } else if ( 'contacts' === post_type ) {
    window.post_profile('delete_profile_location', { post_id: id } )
      .done(function(result) {
        console.log(result)
        jQuery('.remove-location').hide();
        jQuery('.loading-field-spinner.profile_location').removeClass('active')
        window.load_mapbox()
        window.force_values = false
      })
  }
}

/**
 * Save New Church
 */

window.open_create_modal= () => {
  let title = jQuery('#modal-title')
  let content = jQuery('#modal-content')

  title.empty().html(`<h1>Add New Church</h1>`)
  content.html(`
          <div class="grid-x">

            <!-- title -->
            <div class="cell">
              Name <span style="color:red;">*</span><br>
              <div class="input-group">
                <input type="text" style="border:0; border-bottom: 1px solid darkgrey;font-size:1.5rem;line-height: 2rem;" id="group_title" placeholder="" value="" autofocus />
                <div class="input-group-button">
                     <div><span class="loading-field-spinner group_title"></span></div>
                </div>
              </div>
            </div>

            <!-- start date -->
            <div class="cell">
              Start Date<br>
              <div class="input-group">
                <input type="date" style="border:0; border-bottom: 1px solid darkgrey;font-size:1.5rem;line-height: 2rem;" id="group_start_date" value="" />
                <div class="input-group-button">
                     <div><span class="loading-field-spinner group_start_date"></span></div>
                </div>
              </div>
            </div>

            <!-- members -->
            <div class="cell">
              Number of Members<br>
              <div class="input-group">
                <input type="number" style="border:0; border-bottom: 1px solid darkgrey;font-size:1.5rem;line-height: 2rem;" id="group_member_count" value="0" />
                <div class="input-group-button">
                     <div><span class="loading-field-spinner group_member_count"></span></div>
                </div>
              </div>
            </div>

            <!-- location -->
            <div class="cell" id="mapbox-select">
              Location<br>
              <div id="map-wrapper-edit">
                  <div id='map-edit'></div>
              </div>
              <br>
              <button type="button" onclick="remove_location(), 'contacts')" style="display:none;" class="button primary-button-hollow remove-location">Remove Location</button>
              <span class="loading-field-spinner group_location"></span>
            </div>

            <div class="cell">
                <button type="button" class="button">Create Church</button>
            </div>
          </div>
        `)

  jQuery('#edit-modal').foundation('open')

  window.load_create_mapbox()
}

window.load_create_mapbox = () => {

  /***********************************
   * Map
   ***********************************/
  mapboxgl.accessToken = jsObject.map_key;
  var map = new mapboxgl.Map({
    container: 'map-edit',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-20, 30],
    zoom: 1
  });

  /***********************************
   * Click
   ***********************************/
  map.on('click', function (e) {
    console.log(e)

    let lng = e.lngLat.lng
    let lat = e.lngLat.lat
    window.active_lnglat = [lng,lat]

    // add marker
    if ( window.active_marker ) {
      window.active_marker.remove()
    }
    window.active_marker = new mapboxgl.Marker()
      .setLngLat(e.lngLat )
      .addTo(map);

    jQuery('#result_display').html(`Save Clicked Location`)
    jQuery('.remove-location').hide()

    window.location_data = {
      location_grid_meta: {
        values: [
          {
            lng: lng,
            lat: lat,
            source: 'user'
          }
        ],
        force_values: window.force_values
      }
    }

    // save_new_location( post_id )
  });

  /***********************************
   * Search
   ***********************************/
  var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    types: 'country region district locality neighborhood address place',
    mapboxgl: mapboxgl
  });
  map.addControl(geocoder);
  geocoder.on('result', function(e) { // respond to search
    console.log(e)
    if ( window.active_marker ) {
      window.active_marker.remove()
    }
    window.active_marker = new mapboxgl.Marker()
      .setLngLat(e.result.center)
      .addTo(map);
    geocoder._removeMarker()

    jQuery('#result_display').html(`Save Searched Location`)
    jQuery('.remove-location').hide()

    window.location_data = {
      location_grid_meta: {
        values: [
          {
            lng: e.result.center[0],
            lat: e.result.center[1],
            level: e.result.place_type[0],
            label: e.result.place_name,
            source: 'user'
          }
        ],
        force_values: window.force_values
      }
    }

    // save_new_location( post_id )
  })

  /***********************************
   * Geolocate Browser
   ***********************************/
  let userGeocode = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    marker: {
      color: 'orange'
    },
    trackUserLocation: false,
    showUserLocation: false
  })
  map.addControl(userGeocode);
  userGeocode.on('geolocate', function(e) { // respond to search
    console.log(e)
    if ( window.active_marker ) {
      window.active_marker.remove()
    }

    let lat = e.coords.latitude
    let lng = e.coords.longitude

    window.active_lnglat = [lng,lat]
    window.active_marker = new mapboxgl.Marker()
      .setLngLat([lng,lat])
      .addTo(map);

    jQuery('#result_display').html(`Save Current Location`)
    jQuery('.remove-location').hide()

    window.location_data = {
      location_grid_meta: {
        values: [
          {
            lng: lng,
            lat: lat,
            source: 'user'
          }
        ],
        force_values: window.force_values
      }
    }

    // save_new_location( post_id )
  })

  map.dragRotate.disable();
  map.touchZoomRotate.disableRotation();
  map.addControl(new mapboxgl.NavigationControl());

}






/***********************************************************************
 *
 * Profile Section
 *
 */
window.load_profile = () => {
  jQuery.ajax({
    type: "POST",
    data: JSON.stringify({ action: 'get_profile', parts: jsObject.parts }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    url: jsObject.root + jsObject.parts.root + '/v1/' + jsObject.parts.type,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('X-WP-Nonce', jsObject.nonce )
    }
  })
    .done(function(data){
      console.log(data)
      window.write_profile( data )
      jQuery('.loading-spinner').removeClass('active')
    })
    .fail(function(e) {
      console.log(e)
      jQuery('#error').html(e)
      jQuery('.loading-spinner').removeClass('active')
    })
}

window.post_profile = ( action, data ) => {
  return jQuery.ajax({
    type: "POST",
    data: JSON.stringify({ action: action, parts: jsObject.parts, data: data }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    url: jsObject.root + jsObject.parts.root + '/v1/' + jsObject.parts.type,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('X-WP-Nonce', jsObject.nonce )
    }
  })
    .fail(function(e) {
      console.log(e)
      jQuery('#error').html(e)
      jQuery('.loading-spinner').removeClass('active')
    })
}

window.write_profile = ( data ) => {
  let content = jQuery('#wrapper')

  let title = ''
  if ( typeof data.practitioner_community_name === 'undefined' ){
    title = data.title
  } else {
    title = data.practitioner_community_name
  }

  let location = {
    lng: '',
    lat: '',
    label: '',
    grid_meta_id: ''
  }
  if ( typeof data.location_grid_meta !== 'undefined' ){
    location = data.location_grid_meta[0]
  }

  content.empty().html(
    `
    <div class="callout">
      <div class="grid-x">
        <div class="cell">
            <h2>Practitioner Profile</h2>
        </div>
        <div class="cell">
            <div class="section-subheader">
               Community Name
            </div>
            <div class="input-group">
                <input type="text" placeholder="Name" id="title" data-key="${title}" value="${title}" class="dt-communication-channel input-group-field title" />
                <div class="input-group-button">
                     <div class="wrapper-field-spinner"><span class="loading-field-spinner title"></span></div>
                </div>
            </div>
        </div>
        <div class="cell">
            <div class="section-subheader">
               Milestones
            </div>
            <div class="small button-group" id="milestone_wrapper" style="display: inline-block"></div>
        </div>
        <!-- Email -->
        <div class="cell">
            <div class="section-subheader">
                Email
            </div>
            <div id="email-container"></div>
        </div>
        <!-- Phone -->
        <div class="cell">
            <div class="section-subheader">
                Phone
            </div>
            <div id="phone-container"></div>
        </div>
        <!-- location -->
        <div class="cell" id="mapbox-select">
            <div class="section-subheader">
               Location
            </div>
            ${location.label}
            <div id="map-wrapper-edit">
                <div id='map-edit'></div>
            </div>
          <br>
          <button type="button" onclick="remove_location(${data.ID}, 'contacts')" style="display:none;" class="button primary-button-hollow remove-location">Remove Location</button>
          <span class="loading-field-spinner profile_location"></span>
        </div>
      </div>
    </div>

    <div class="callout">
      <div class="grid-x">
        <div class="cell">
            <h2>Community Visibility</h2>
        </div>
        <div class="cell">
            <label>Connect me with others in my area or interested in our local work.</label>
           <div class="switch large">
            <input class="switch-input" id="connect-with-others" type="checkbox" name="exampleSwitch">
            <label class="switch-paddle" for="connect-with-others">
              <span class="show-for-sr">Hide on public map?</span>
              <span class="switch-active" aria-hidden="true">Yes</span>
              <span class="switch-inactive" aria-hidden="true">No</span>
            </label>
          </div>
        </div>
      </div>
    </div>
   `)

  window.load_mapbox( location.lng, location.lat, data.ID, 'contacts' )

  // add fields
  if ( typeof jsObject.post_fields.milestones !== 'undefined' ){
    let m_wrapper = jQuery('#milestone_wrapper')
    let m_class = ''
    jQuery.each(jsObject.post_fields.milestones.default, function(i,v){
      m_class = 'empty-select-button'
      if ( typeof data.milestones !== 'undefined' && findValueInArray(i,data.milestones) ){
        m_class = 'selected-select-button'
      }
      m_wrapper.append(`
        <button id="${i}" type="button" data-field-key="milestones" data-option-key="${i}" class="dt_multi_select ${m_class} select-button button">
          <img class="dt-icon" src="${v.icon}">
            ${v.label}
        </button>
      `)
    })
  }

  let phone_container = jQuery('#phone-container')
  let phone_value = ''
  if ( typeof data.contact_phone !== 'undefined' ){
    phone_value = data.contact_phone[0].value
  }
  phone_container.append(`
    <div class="input-group">
        <input id="" type="text" data-field="contact_phone" value="${phone_value}" class="dt-communication-channel input-group-field phone" dir="auto">
        <div class="input-group-button">
            <div class="wrapper-field-spinner"><span class="loading-field-spinner phone"></span></div>
        </div>
    </div>
  `)

  let email_container = jQuery('#email-container')
  let email_value = ''
  if ( typeof data.contact_email !== 'undefined' ){
    email_value = data.contact_email[0].value
  }
  email_container.append(`
    <div class="input-group">
        <input id="" type="text" data-field="contact_phone" value="${email_value}" class="dt-communication-channel input-group-field email" dir="auto">
        <div class="input-group-button">
            <div class="wrapper-field-spinner"><span class="loading-field-spinner email"></span></div>
        </div>
    </div>
  `)


  jQuery('.dt-communication-channel.input-group-field.title').on('change', function(e){
    jQuery('.loading-field-spinner.title').addClass('active')
    window.post_profile('update_profile_title', { post_id: data.ID, new_value: e.target.value } )
      .done(function(result) {
        console.log(result)
        if ( typeof result.errors !== 'undefined') {
          console.log(result)
        }
        jQuery('.loading-field-spinner.title').removeClass('active')
      })
  })
  jQuery('.dt_multi_select').on('click', function(e){
    // jQuery('.loading-field-spinner.title').addClass('active')
    let key = jQuery(this).data('field-key')
    let option = jQuery(this).data('option-key')
    let state = jQuery(this).hasClass('selected-select-button')

    if ( state ) {
      jQuery(this).removeClass('selected-select-button')
      jQuery(this).addClass('empty-select-button')
    } else {
      jQuery(this).addClass('selected-select-button')
      jQuery(this).removeClass('empty-select-button')
    }
    window.post_profile('update_multiselect', { post_id: data.ID, key: key, option: option, state: state } )
      .done(function(result) {
        console.log(result)
        if ( typeof result.errors !== 'undefined') {
          console.log(result)
        }
        jQuery('.loading-field-spinner.title').removeClass('active')
      })
  })
  jQuery('.dt-communication-channel.input-group-field.email').on('change', function(e){
    jQuery('.loading-field-spinner.email').addClass('active')
    window.post_profile('update_profile_email', { post_id: data.ID, new_value: e.target.value } )
      .done(function(result) {
        console.log(result)
        if ( typeof result.errors !== 'undefined') {
          console.log(result)
        }
        jQuery('.loading-field-spinner.email').removeClass('active')
      })
  })
  jQuery('.dt-communication-channel.input-group-field.phone').on('change', function(e){
    jQuery('.loading-field-spinner.phone').addClass('active')
    window.post_profile('update_profile_phone', { post_id: data.ID, new_value: e.target.value } )
      .done(function(result) {
        console.log(result)
        if ( typeof result.errors !== 'undefined') {
          console.log(result)
        }
        jQuery('.loading-field-spinner.phone').removeClass('active')
      })
  })

}

function findValueInArray(value,arr){
  var result = false;

  for(var i=0; i<arr.length; i++){
    var name = arr[i];
    if(name === value){
      result = true;
      break;
    }
  }

  return result;
}


