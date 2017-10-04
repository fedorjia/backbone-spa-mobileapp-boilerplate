import Component from '../../framework/generic/component';
import viewport from '../../framework/viewport';
import Handler from '../../framework/handler';
import config from '../../framework/config';

import Infinite from '../../common/widget/infinite';
import template from './index.html';
import ProductItem from './product-item';
import CartOverlay from '../../common/component/cart-overlay';
import Cart from '../cart';


class HomeView extends Component {
    // initialize() {
    //     super.initialize();
    //     this.constructor.__super__.initialize.apply(this);
    // }
    constructor() {
        super({
            className: 'home-view',
            events: {

            }
        });

        // message handler
        this.hander = new Handler(this.onMsgReceived.bind(this));

        // infinite
        this.infinite = new Infinite({
            url: '/api/list',
            limit: 10,
            onDataReceived: this.setup.bind(this)
        });

        // cart overaly
        this.cartOverlay = new CartOverlay({handler: this.hander});
    }

    /**
     * view did appear lifecycle
     */
    viewDidAppear() {
        // when home view did appear, remove all views from cahce except home view
        viewport.index();
        this.cartOverlay.refresh();
    }

    /**
     * mount ui
     */
    render() {
        super.render();
        // render view
        this.$el.html(template());
        // render infinite
        this.infinite.render(this.$el.find('.wrapper'));
        // render cartOverlay
        this.cartOverlay.render(this.$el);
        return this;
    }

    /**
     * setup ui
     */
    setup(items) {
        const $items = this.$el.find('.items');
        for(let item of items) {
            const itemView = new ProductItem(item, this.hander);
            $items.append(itemView.render().el);
        }
    }

    /**
     * on message received
     */
    onMsgReceived(which, args) {
        switch (which) {
            // refresh count
            case 1000: {
                this.cartOverlay.refresh();
                break;
            }
            case 2000: {
                if(config.isActiveRouter) {
                    this.router.nav('cart');
                } else {
                    viewport.fly(Cart);
                }
                break;
            }
        }
    }
}

export default HomeView;