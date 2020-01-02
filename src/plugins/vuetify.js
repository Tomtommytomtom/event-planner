import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes:{
            light: {
                primary: '#F07F1D',
                secondary: '#A3A3A3',
                success: '#006b3a',
                info: '#1E90FF',
                error: 	'#FF1493',
            }
        }
    }
});
