'use strict';
const initialState =
{
	serverRender : true
};

export default (state = initialState, action) =>
{
	switch(action.type)
	{
		case 'SERVER_RENDER_DONE':
			return {...state, serverRender : false};
		default:
			return state;
	}
}