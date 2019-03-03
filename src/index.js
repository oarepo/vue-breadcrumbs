import BreadcrumbsStoreModule from './store/breadcrumbs';


const BreadcrumbsModule = {
    install(Vue, {
        store,
    }) {

        Vue.prototype.breadcrumbs$ = new BreadcrumbsStoreModule({
            store,
            name: 'breadcrumbs',
        });
    },
};

export default BreadcrumbsModule;
