import React, { Component } from 'react';
import i18n from 'i18n';
import PopoverField from 'components/PopoverField/PopoverField';
import classnames from 'classnames';

/**
 * Renders the right-hand collapsable change preview panel
 */
class Preview extends Component {
  constructor(props) {
    super(props);

    this.handleBackClick = this.handleBackClick.bind(this);
  }

  handleBackClick(event) {
    if (typeof this.props.onBack === 'function') {
      event.preventDefault();
      this.props.onBack(event);
    }
  }

  /**
   * Returns list of toolbar buttons
   *
   * @return {Array}
   */
  buildToolbarButtons() {
    const toolbarButtons = [];
    if (this.props.itemLinks && this.props.itemLinks.edit) {
      const editUrl = this.props.itemLinks.edit.href;
      toolbarButtons.push(
        <a key="edit" href={editUrl} className="btn btn-outline-secondary font-icon-edit">
          <span className="btn__title">{i18n._t('Admin.EDIT', 'Edit')}</span>
        </a>
      );
    }
    return toolbarButtons;
  }

  renderPopover() {
    if (!this.props.moreActions || this.props.moreActions.length === 0) {
      return null;
    }
    const props = {
      data: { placement: 'top' },
      id: this.props.moreActionsPopoverId,
    };
    return (
      <PopoverField {...props}>
        {this.props.moreActions}
      </PopoverField>
    );
  }

  renderBackButton() {
    if (typeof this.props.onBack !== 'function') {
      return null;
    }
    return (
      <button
        className="btn btn-secondary font-icon-left-open-big toolbar__back-button hidden-lg-up"
        type="button"
        onClick={this.handleBackClick}
      >{i18n._t('Admin.BACK', 'Back')}</button>
    );
  }

  renderBody() {
    let previewUrl = null;
    let previewType = '';

    // Find preview url
    if (this.props.itemLinks && this.props.itemLinks.preview) {
      if (this.props.itemLinks.preview.Stage) {
        previewUrl = this.props.itemLinks.preview.Stage.href;
        previewType = this.props.itemLinks.preview.Stage.type;
      } else if (this.props.itemLinks.preview.Live) {
        previewUrl = this.props.itemLinks.preview.Live.href;
        previewType = this.props.itemLinks.preview.Live.type;
      }
    }

    // No item available
    if (!this.props.itemId) {
      return (
        <div className="preview__overlay">
          <h3 className="preview__overlay-text">
            {i18n._t('Admin.NO_PREVIEW', 'No preview available.')}
          </h3>
        </div>
      );
    }

    // No preview url
    if (!previewUrl) {
      return (
        <div className="preview__overlay">
          <h3 className="preview__overlay-text">
            {i18n._t('Admin.NO_ITEM_PREVIEW', 'There is no preview available for this item.')}
          </h3>
        </div>
      );
    }

    // Show image preview
    if (previewType && previewType.indexOf('image/') === 0) {
      return (
        <div className="preview__file-container panel--scrollable">
          <img alt={previewUrl} className="preview__file--fits-space" src={previewUrl} />
        </div>
      );
    }

    // Show iframe preview
    return <iframe className="flexbox-area-grow preview__iframe" src={previewUrl} />;
  }

  render() {
    const { className } = this.props;

    const classNames = classnames('preview', className);
    return (
      <div className={classNames}>
        {this.renderBody()}
        <div className="toolbar toolbar--south">
          { this.renderBackButton() }
          <div className="btn-toolbar">
            {this.buildToolbarButtons()}
            {this.renderPopover()}
          </div>
        </div>
      </div>
    );
  }
}

Preview.propTypes = {
  className: React.PropTypes.string,
  itemLinks: React.PropTypes.object,
  itemId: React.PropTypes.number,
  onBack: React.PropTypes.func,
  moreActions: React.PropTypes.arrayOf(React.PropTypes.element),
  moreActionsPopoverId: React.PropTypes.string,
};

Preview.defaultProps = {
  className: 'flexbox-area-grow fill-height',
};

export default Preview;
