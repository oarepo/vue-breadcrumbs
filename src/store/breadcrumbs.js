import {
    Action,
    Module,
    Mutation,
    VuexModule,
} from 'vuex-class-modules';

function toArray(x) {
    if (x === undefined) {
        return undefined;
    }
    if (Array.isArray(x)) {
        return [...x];
    }
    return [x];
}

@Module
class BreadcrumbsModule extends VuexModule {

    // breadcrumbs is an array of { label, icon, destination }
    breadcrumbs = [];

    matched = [];

    pendingBreadcrumbs = {};

    @Mutation
    setInternalBreadcrumbs(matchedWithBreadcrumbs) {
        this.matched = matchedWithBreadcrumbs;
        this.breadcrumbs = matchedWithBreadcrumbs.filter(x => !!x.breadcrumbs).map(x => x.breadcrumbs).flat();
        this.pendingBreadcrumbs = {};
    }

    @Action
    routeChanged(route) {
        const { matched } = route;

        if (matched.some(x => !x.instances.default)) {
            setTimeout(() => {
                this.routeChanged(route);
            }, 10);
        } else {

            let samePathLength = 0;
            for (; samePathLength < Math.min(matched.length, this.matched.length); samePathLength += 1) {
                if (matched[samePathLength].instances.default !== this.matched[samePathLength].instance) {
                    break;
                }
            }
            const localMatched = this.matched.slice(0, samePathLength);
            if (matched.length > samePathLength) {
                matched.slice(samePathLength).forEach((routeMatchItem) => {
                    const instance = routeMatchItem.instances.default;

                    const pendingBreadcrumbs = this.pendingBreadcrumbs[instance._uid];
                    const instanceBreadcrumbs = toArray(instance.breadcrumbs);
                    const routeBreadcrumbs = toArray(routeMatchItem.meta.breadcrumbs);

                    const bc = {
                        instance: instance._uid,
                        breadcrumbs: pendingBreadcrumbs || instanceBreadcrumbs || routeBreadcrumbs || [],
                    };
                    localMatched.push(bc);
                });
            }
            this.setInternalBreadcrumbs(localMatched);
        }
    }

    @Mutation
    setInternalInstanceBreadcrumbs({ instance, breadcrumbs }) {
        const matched = [...this.matched];
        const found = matched.some((m) => {
            if (m.instance === instance._uid) {
                m.breadcrumbs = toArray(breadcrumbs);
                return true;
            }
            return false;
        });
        if (found) {
            this.matched = matched;
            this.breadcrumbs = matched.filter(x => !!x.breadcrumbs).map(x => x.breadcrumbs).flat();
            this.pendingBreadcrumbs = {};
        } else {
            this.pendingBreadcrumbs[instance._uid] = toArray(breadcrumbs);
        }
    }

    @Action
    setBreadcrumbs({ instance, breadcrumbs }) {
        this.setInternalInstanceBreadcrumbs({ instance, breadcrumbs });
    }

}

export default BreadcrumbsModule;
