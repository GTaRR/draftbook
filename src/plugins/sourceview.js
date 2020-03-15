import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import codeIcon from '@ckeditor/ckeditor5-basic-styles/theme/icons/code.svg';

class SourceView extends Plugin {
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add( 'sourceView', locale => {
           const view = new ButtonView( locale );
           const event = new CustomEvent("showSourceModal");

           view.set( {
               label: 'Просмотреть исходный код',
               icon: codeIcon,
               tooltip: true
           } );

           view.on( 'execute', () => {
               document.dispatchEvent(event);
           } );

           return view;
        } );
    }
}

export default SourceView;
