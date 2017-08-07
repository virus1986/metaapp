package bingo.app.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import bingo.lang.Strings;
import bingo.lang.http.HttpStatus;
import bingo.metaapp.security.SmartSecurityFilter;
import bingo.metaapp.web.common.exception.Exception404;
import bingo.metaapp.web.utils.PasswordEncoder;
import bingo.metaapp.web.workflow.service.StatisticsWorkflowTaskManager;
import bingo.metaapp.web.workflow.service.WorkflowService;
import bingo.metabase.Mb;
import bingo.metabase.bussiness.data.DataManager;
import bingo.metabase.data.value.Entity;
import bingo.metabase.data.value.MutableEntity;
import bingo.metabase.utils.AppContext;
import bingo.metabase.utils.MetadataUtils;
import bingo.security.SecurityContext;

@Controller
@RequestMapping({"/home",""})
public class HomeController {
	@Autowired
	private DataManager dataManager;
	@Autowired
	private StatisticsWorkflowTaskManager TaskManager;
	@Autowired private WorkflowService workflowService;
	@RequestMapping(value={"/",""},method=RequestMethod.GET)
	public ModelAndView home(){
		ModelAndView mv = new ModelAndView("home/index");
//		AppContext.getBean(NcManager.class).correctBusinessId();
//		AppContext.getBean(ImportManager.class).importCapxBudgetData();
		return mv;
	}
	
	@RequestMapping(value="/workspace",method=RequestMethod.GET)
	public ModelAndView workspace(){
		ModelAndView mv = new ModelAndView("home/workspace");
		mv.addObject("otherWorkFlows", workflowService.getAllWorkflows());
		return mv;
	}
	@RequestMapping(value="/statisticsPendingTask",method=RequestMethod.GET)
	@ResponseBody
	public Object statisticsPendingTask(){
		return TaskManager.statisticsPendingTask(SecurityContext.getCurrentUser());//待办统计
	}
	@RequestMapping(value="/statisticsDoingTask",method=RequestMethod.GET)
	@ResponseBody
	public Object statisticsDoingTask(){
		return TaskManager.statisticsDoingTask(SecurityContext.getCurrentUser());//处理中统计
	}
	@RequestMapping(value="/statisticsForReadingTask",method=RequestMethod.GET)
	@ResponseBody
	public Object statisticsForReadingTask(){
		return TaskManager.statisticsForReadingTask(SecurityContext.getCurrentUser());//待阅统计
	}
	@RequestMapping(value="/error_404",method=RequestMethod.GET)
	public ModelAndView pageNotFound(HttpServletRequest request){
		throw new Exception404((String)request.getAttribute("javax.servlet.error.request_uri"));
	}
	@RequestMapping(value="/error_401",method=RequestMethod.GET)
	public ModelAndView unAuthorized(){
		ModelAndView mv=new ModelAndView("common/error_401");
		mv.addObject("masterPage", "common/single");
		return mv;
	}
	@RequestMapping(value="/error_403",method=RequestMethod.GET)
	@ResponseBody
	public Object unAuthorized(HttpServletResponse response){
		response.setStatus(HttpStatus.SC_FORBIDDEN);
		return "request is 403 forbidden";
	}

	@RequestMapping(value="/reloadmetadata",method=RequestMethod.GET)
	@ResponseBody
	public Object reloadMetaData(@RequestParam(value="name",required=false) String name){
		if(Strings.isEmpty(name)){
			Mb.reload();
		}else{
			Mb.reload(name);
		}
		return 1;
	}

	@RequestMapping(value="/changepwd",method=RequestMethod.GET)
	public ModelAndView changePwd(){
		String viewPath=MetadataUtils.genNameForModelAndView("User", "changepwd");
		ModelAndView mv= new ModelAndView(viewPath);
		String curUserId=SecurityContext.getCurrentUser().getId();
		Entity user=dataManager.find("User", curUserId);
		mv.addObject("entity", user);
		return mv;
	}

	@RequestMapping(value="/changepwd",method=RequestMethod.POST)
	@ResponseBody
	public Map<String,Object> changePwd(@RequestParam(value="oldPwd") String oldPwd,@RequestParam(value="newPwd") String newPwd){
		Map<String,Object> reVal=new HashMap<String, Object>();
		String curUserId=SecurityContext.getCurrentUser().getId();
		Entity user=dataManager.find("User", curUserId);
		String pwd=(String)user.get("Password");
		if(!Strings.equals(PasswordEncoder.encode(oldPwd), pwd)){
			reVal.put("isValid", false);
			Map<String,Object> errors=new HashMap<String, Object>();
			errors.put("oldPwd", "密码不正确!");
			reVal.put("errors", errors);
			return reVal;
		}
		user.set("Password", PasswordEncoder.encode(newPwd));
		dataManager.update("User",user);
		return reVal;
	}
	
	@RequestMapping(value="/logout",method=RequestMethod.GET)
	public String logout(HttpServletRequest request){
		String loginMode = SmartSecurityFilter.LOCAL_LOGIN;
		SmartSecurityFilter smartSecurityFilter = AppContext.getOrCreateFirstBeanOfType(SmartSecurityFilter.class);
		if (null != smartSecurityFilter) {
			loginMode = smartSecurityFilter.getLoginMode();
		}
		String redirectUrl="";
		// 根据不同的登录模式做不同注销处理
		if (SmartSecurityFilter.LOCAL_LOGIN.equalsIgnoreCase(loginMode)) {
			SecurityContext.getProvider().signOut(request);
			redirectUrl= "redirect:/";
		} else {
			redirectUrl= "redirect:/ssoclient/logout";
		} 
		return redirectUrl;
	}
	
	
	
	@RequestMapping(value = "/formatOrgCodeICode", method = RequestMethod.GET)
	@ResponseBody
	public void formatCodeICode(){
		List<Map<String,Object>> results = this.dataManager.query("Organization", "parentId is null", null) ;
		int icode = 10000  ;
		for(Map<String,Object> map : results){//root
			icode++ ;
			MutableEntity entity = new MutableEntity("Organization") ;
			entity.setAll(map) ;
			entity.set("icode", icode) ;
			entity.set("code", String.valueOf(icode) ) ;
			this.dataManager.update("Organization", entity) ;
			//format Child
			icode = this.formatChildCodeICode("Organization", map.get("id").toString() , String.valueOf(icode) , icode) ;
		}
		
		/*results = this.dataManager.query("UamExternalOrganization", "parentId is null", null) ;
		icode = 30000  ;
		for(Map<String,Object> map : results){//root
			icode++ ;
			MutableEntity entity = new MutableEntity("UamExternalOrganization") ;
			entity.setAll(map) ;
			entity.set("icode", icode) ;
			entity.set("code", String.valueOf(icode) ) ;
			this.dataManager.update("UamExternalOrganization", entity) ;
			//format Child
			icode = this.formatChildCodeICode( "UamExternalOrganization" ,map.get("orgId").toString() , String.valueOf(icode) , icode) ;
		}*/
	}
	
	private int formatChildCodeICode(String entityName,String parentId,String parentCode,int icode){
		List<Map<String,Object>> results = this.dataManager.query(entityName, "parentId = ?", parentId) ;
		for(Map<String,Object> map : results){//root
			MutableEntity entity = new MutableEntity(entityName) ;
			entity.setAll(map) ;
			icode = icode+1 ;
			entity.set("icode",icode) ;
			entity.set("code", parentCode+"."+icode ) ;
			this.dataManager.update(entityName, entity) ;
			//format Child
			icode = this.formatChildCodeICode(entityName, map.get("id").toString() , parentCode+"."+icode , icode) ;
		}
		return icode ;
	}
	
	
	
	
}
