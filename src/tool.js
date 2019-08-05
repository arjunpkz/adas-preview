import { Tool, Path, Group, Point, View } from "paper";
import { Store } from "vuex";

/**
 * Create the tool
 * @param {Store} store the vuex store instance
 * @param {View} view the paper canvas view
 */
export default function (store, view) {

    const tool = new Tool()

    let lastPoint = null

    let cursor = null

    const createCursor = (point) => {

        cursor && cursor.remove()

        const half_rad = 5 * 1/store.state.zoom

        cursor = new Group([
            new Path.Line(new Point(point.x - half_rad, point.y), new Point(point.x + half_rad, point.y)),
            new Path.Line(new Point(point.x, point.y - half_rad), new Point(point.x, point.y + half_rad))
        ])

        cursor.locked = true

        cursor.style = {
            strokeWidth: 1 * 1/store.state.zoom,
            strokeColor: 'aqua'
        }
    }

    tool.onMouseMove = (event) => {

        createCursor(event.point)
    }

    tool.onMouseDown = (event) => {

        console.log(event.modifiers.space)

        if (event.modifiers.space) {

            lastPoint = view.projectToView(event.point)

        }

        else if (event.item && event.item.data) {
            
            if (event.item.data.id !== undefined) store.dispatch('selectLabel', event.item.data.id)
        }
    }

    tool.onMouseUp = (event) => {
        lastPoint = null
    }

    tool.onMouseDrag = (event) => {

        if (event.modifiers.space) {

            //convert the point to view coordinates to prevent the jaggering due to instability in coordinates when view is changed
            const point = view.projectToView(event.point);

            //convert the last point back to project coordinate to calculate delta value
            const last = view.viewToProject(lastPoint);

            // calculate delta
            const delta = last.subtract(event.point)

            //scroll the view by the delta value computed by subtracting the current mouse point from the downpoint
            view.scrollBy(delta)

            //set last point as the current point
            lastPoint = point
        }
    }

    return tool
}