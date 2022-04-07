import { LOGIN_START,LOGIN_FAILURE,LOGIN_SUCCESS,REGISTER_START,REGISTER_FAILURE,REGISTER_SUCCESS,NULL_ERROR,AUTH_USER,LOGOUT } from '../actions';

export default (state,action)=>{
	switch(action.type){

		case LOGIN_START:
		case REGISTER_START:
			return{
				...state,
				isFetching:true,
			}

		case LOGIN_SUCCESS:
			localStorage.setItem('token',action.payload.token);
			return{
				...state,
				isFetching:false,
				logged:true,
			}

		case REGISTER_SUCCESS:
			return{
				...state,
				isFetching:false
			}

		case LOGIN_FAILURE:
		case REGISTER_FAILURE:
			return{
				...state,
				isFetching:false,
				fetchingError:action.payload,
			}

		case AUTH_USER:
			return{
				...state,
				user:action.payload,
				logged:true,
			}

		case NULL_ERROR:
			return{
				...state,
				fetchingError:null
			}

		case LOGOUT:
			localStorage.removeItem('token');
			return{
				...state,
				user:null,
				logged:false,
				token:null
			}

		default:
			return state;
	}
}