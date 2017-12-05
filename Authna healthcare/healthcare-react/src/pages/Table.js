import React, { Component } from 'react';
import axios from "axios";
import FusionCharts from 'fusioncharts';
// Load the charts module
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';

export default class Table extends Component {
	constructor(props){
		 super(props);
		 this.state={
		 	searchText: '',
		 	data:[],
		 	page:1,
		 	recordsPerPage: 5,
		 	totalRecords:0,
		 	ascending:{
		 		id: true,
				username: true,
				difficulty: true,
				starttime: true,
				endtime: true,
				score: true,
		 	}
		 }
	}
	componentWillMount(){
		this.renderRecords();
	}
	renderRecords(){
		const { page } = this.state;
		//console.log("page", this.state)
		axios.get(`/api/users/${page}`)
		.then((res)=>{
			const { data,totalRecords } = res.data;
			this.setState({
				 data,totalRecords
			})
		})
		.catch((error)=>{
			console.log(error);
		})
	}
	onHandlePagination =(e)=>{

		e.preventDefault();
		const { page, recordsPerPage, totalRecords } = this.state;
		const currentRecord = e.target.getAttribute('name');
		if(currentRecord=="prev"){
			this.setState({
				page: (Number(page)-1<1) ? 1 : Number(page)-1
			},()=>{
				 if(page>1){
				 	this.renderRecords();
				 }
			})
		}else{
			const isNextPage = totalRecords - (page*recordsPerPage) > 0 ? (page+1) : page;
			this.setState({
				page: isNextPage
			},()=>{
				if(totalRecords - (page*recordsPerPage) > 0){
					this.renderRecords();
				}
			})
		}	
		
	}
	renderTable =()=>{

		const { data, searchText, page } = this.state;

		const filteredData = data.filter((planet)=>{
			return planet.username.toLowerCase().indexOf(searchText.toLowerCase())!== -1
		});

		if(filteredData){
			return filteredData.map((value, idx)=>{
				return(
					<tr key={idx}>
						<td key={`id-${idx}`}>{value.id}</td>
						<td key={`username-${idx}`}>{value.username}</td>
						<td key={`difficulty-${idx}`}>{value.difficulty}</td>
						<td key={`starttime-${idx}`}>{value.starttime}</td>
						<td key={`endtime-${idx}`}>{value.endtime}</td>
						<td key={`score-${idx}`}>{value.score}</td>
					</tr>
				)
		});
		}
		
		return null;
	}
	sortTable = (name, isasc)=>{
		const { data } = this.state;
		let asceData = [];

		switch(isasc){
			case true:
			 
				asceData = data.sort((a,b)=>{
				 	 var nameA = a[name].toString().toUpperCase(); 
					  var nameB = b[name].toString().toUpperCase(); 
					  if (nameA < nameB) {
					    return -1;
					  }
					  if (nameA > nameB) {
					    return 1;
					  }
					  return 0;
				});
				break;
			case false:
			
				asceData = data.sort((a,b)=>{
				 	 var nameA = a[name].toString().toUpperCase(); 
					  var nameB = b[name].toString().toUpperCase(); 
					  if (nameA > nameB) {
					    return -1;
					  }
					  if (nameA < nameB) {
					    return 1;
					  }
					  return 0;
				});
			 	break;	
		}
		return asceData;
	}
	onSortHandle = (e)=>{
		const currentElement = this.state.ascending[e.target.getAttribute('name')];
		const newData = this.sortTable(e.target.getAttribute('name'),!currentElement);

		this.setState({
			ascending: {...this.state.ascending, [e.target.getAttribute('name')]:!currentElement},
			data : newData
		});

	}
	onSearchHandle =(e)=>{
		
		this.setState({
			searchText: e.target.value
		});
	}
	render() {
		const { searchText, ascending, data, page, totalRecords, recordsPerPage } = this.state;

		// Pass fusioncharts as a dependency of charts
		let chartData = [];
		data.map((value, idx)=>{
			let {username, score} = value;
			chartData[idx]={"label":username,"value":score};
		});
		//console.log(chartData);
		charts(FusionCharts);
		var chartConfigs = {
		    type: "Column2D",
		    className: "fc-column2d", // ReactJS attribute-name for DOM classes
		    dataFormat: "JSON",
		    dataSource: {
		        chart:{
		        	caption: "Miniclick",
		            subCaption: "",
		            numberPrefix: "",
		            theme: "ocean"
		        },
		        data: chartData
		    }
		};

		return (
			<div>
				<div>
					<input type="text" className="search" name="" value={searchText} onChange={this.onSearchHandle}/>
				</div>
				<table>
					 <thead className="headerWrapper">
					  <tr>
					    <th>ID<span className={`sort-arrow ${ascending.id ? "active": ""}`} name="id" onClick={this.onSortHandle}></span></th>
		    			<th>UserName<span className={`sort-arrow ${ascending.username ? "active": ""}`} name="username" onClick={this.onSortHandle}></span></th>
		    			<th>difficult level<span className={`sort-arrow ${ascending.difficulty ? "active": ""}`} name="difficulty" onClick={this.onSortHandle}></span></th>
		    			<th>Start Time<span className={`sort-arrow ${ascending.starttime ? "active": ""}`} name="starttime" onClick={this.onSortHandle}></span></th>
		    			<th>End Time<span className={`sort-arrow ${ascending.endtime ? "active": ""}`} name="endtime" onClick={this.onSortHandle}></span></th>
		    			<th>Score<span className={`sort-arrow ${ascending.score ? "active": ""}`} name="score" onClick={this.onSortHandle}></span></th>
					  </tr>
					</thead>
					<tbody>
				  		{this.renderTable()}
				  	</tbody>	
				</table> 
				<div className="pagination-container">
					<a href="#" name="prev" className={`round ${page==1? "disabled":""} `} onClick={this.onHandlePagination}>&#8249;</a>
						<input type="text" value={page} readOnly/>
					<a href="#" name="next" className={`round ${totalRecords - (page*recordsPerPage) > 0 ? "": "disabled"}`} onClick={this.onHandlePagination}>&#8250;</a>
				</div>
				<div className="chart-container">
				 <ReactFC {...chartConfigs} />
				</div> 
			</div>
		);
	}
}
