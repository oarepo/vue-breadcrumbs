# Breadcrumbs in VueJS/Quasar

This library provides a generic vuex-based mechanism for handling breadcrumbs automatically 
by router changes.

## Installation

```
yarn add @cesnet/vue-breadcrumbs
```

## Usage

### Plugin registration

```javascript
    Vue.use(BreadcrumbsModule, {
        store: store,
    });
```

After registration, the store module (with name breadcrumbs) binds to `Vue.breadcrumbs$`.

### Rendering breadcrumbs

```html
    <q-toolbar>
        <q-breadcrumbs active-color="primary" style="font-size: 16px">
            <q-breadcrumbs-el :label="b.label" :icon="b.icon" :to="b.destination" 
                              v-for="(b, idx) in shownBreadcrumbs"
                              :key="idx"/>
    </q-toolbar>
```

```javascript
    computed: {
        shownBreadcrumbs: function() {
            return this.breadcrumbs$.breadcrumbs;
        }
    }
```

### Router

```javascript
    const Router = new VueRouter({
        routes: []
    });

    Router.afterEach(() => {
        Router.app.breadcrumbs$.routeChanged(Router.currentRoute);
    });
```

If statically defined breadcrumbs are enough, place them to `meta` on route:

```javascript
        routes: [{
            path: '/',
            component: MyComponent,
            meta: {
                breadcrumbs: {
                    label: 'Home',
                    icon: 'home',
                    destination: '/'
                }
            },
        }]
```

The `breadcrumbs` property might be an array of objects - in this case, all the breadcrumbs are rendered.

### Inside Components

To generate breadcrumbs dynamically place a data/computed property into a Vue component. 
`vue-breadcrumbs` will pick it up automatically and render them to the correct place.

```javascript
export default @Component({
    props: {
        collectionCode: String,
    },
})
class OARepoCollectionPageContainer extends Vue {

    get breadcrumbs() {
        // breadcrumbs before the collection is loaded
        return [
            {
                label: this.$t('uct.collection'),
                icon: 'view_list',
                destination: `/${this.collectionCode}`,
            },
        ];
    }
}
```

### Updating breadcrumbs dynamically

To dynamically update breadcrumbs (for example, after loading an external resource), 
call `this.breadcrumbs$.setBreadcrumbs` with the following arguments:

```javascript
    function updateBreadcrumbs() {
        this.breadcrumbs$.setBreadcrumbs({
            instance: this,
            breadcrumbs: generateBreadcrumbs()
        });
    }
```

Method `updateBreadcrumbs` is called whenever the breadcrumbs should be updated 
(in watched properties, promises, timers, ...). `instance` is the Vue instance
whose breadcrumbs will be updated.
