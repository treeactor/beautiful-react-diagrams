import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import { useRenderInfo } from 'beautiful-react-hooks';
import { CoordinatesType, PortType } from '../../shared/Types';
import NodeDefault from '../NodeDefault';
import useDragAround from './useDragAround';
import { zoomState } from '../../state/canvas';

import './node-draggable-element.scss';

const makeStyle = ([x, y] = [0, 0]) => ({ left: x, top: y });

/**
 * // TODO: document this
 * @param props
 * @returns {*}
 * @constructor
 */
const NodeDraggableElement = (props) => {
  const {
    id, coordinates, nodeIndex, disableDrag, onPositionChange, content, inputs, outputs, data, className,
    render: ContentNode, ElementRender,
  } = props;
  const elRef = useRef();
  const zoom = useRecoilValue(zoomState);
  const style = useMemo(() => makeStyle(coordinates), [coordinates]);
  const [isDragging, startDrag] = useDragAround({ onPositionChange, disableDrag, zoom, nodeIndex, elRef });
  const classList = useMemo(() => (
    classNames('bi bi-diagram-node', { 'node-draggable': !disableDrag, dragging: isDragging }, className)
  ), [disableDrag, isDragging, className]);

  useRenderInfo(`NodeDraggableElement, id: ${id}`);

  return (
    <ElementRender className={classList} onMouseDown={startDrag} onTouchStart={startDrag} data-brd-id={id} style={style} ref={elRef}>
      <ContentNode
        id={id}
        content={content}
        inputs={inputs}
        outputs={outputs}
        data={data}
        coordinates={coordinates}
        isDragging={isDragging}
      />
    </ElementRender>
  );
};

NodeDraggableElement.propTypes = {
  /**
   * The diagram node id
   */
  id: PropTypes.oneOfType([PropTypes.string]).isRequired,
  /**
   * The position of the node within the schema
   */
  nodeIndex: PropTypes.number.isRequired,
  /**
   * The diagram current coordinates, relative to the container
   */
  coordinates: CoordinatesType,
  /**
   * Defines whether the drag functionality is enabled
   */
  disableDrag: PropTypes.bool,
  /**
   * The callback to be fired when the node coordinates change
   */
  onPositionChange: PropTypes.func.isRequired,
  /**
   * The wrapping element
   */
  ElementRender: PropTypes.elementType,
  /**
   * The rendering element
   */
  render: PropTypes.elementType,
  /**
   * The diagram content
   */
  content: PropTypes.elementType,
  /**
   * An array of input ports
   */
  inputs: PropTypes.arrayOf(PortType),
  /**
   * An array of output ports
   */
  outputs: PropTypes.arrayOf(PortType),
  /**
   * An object to possibly keep data between renders
   */
  data: PropTypes.shape({}),
  /**
   * The callback to be fired when a new port is settled
   */
  onPortRegister: PropTypes.func,
  /**
   * The callback to be fired when component unmount
   */
  onNodeRemove: PropTypes.func,
  /**
   * The callback to be fired when dragging a new segment from one of the node's port
   */
  onDragNewSegment: PropTypes.func,
  /**
   * The callback to be fired when a new segment fails to connect
   */
  onSegmentFail: PropTypes.func,
  /**
   * The callback to be fired when a new segment connects to a port
   */
  onSegmentConnect: PropTypes.func,
};

NodeDraggableElement.defaultProps = {
  disableDrag: false,
  render: NodeDefault,
  coordinates: [0, 0],
  ElementRender: 'article',
  content: null,
  data: null,
  outputs: [],
  inputs: [],
};

export default React.memo(NodeDraggableElement);