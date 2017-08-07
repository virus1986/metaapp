/**
 * @author nicolas.peters
 * 
 * Contains all strings for the default language (en-us). Version 1 - 08/29/08
 */
if (!ORYX)
	var ORYX = {};

if (!ORYX.I18N)
	ORYX.I18N = {};

ORYX.I18N.Language = "zh_cn"; // Pattern <ISO language code>_<ISO country
								// code> in lower case!

if (!ORYX.I18N.Oryx)
	ORYX.I18N.Oryx = {};

ORYX.I18N.Oryx.title = ORYX.TITLE;
ORYX.I18N.Oryx.noBackendDefined = "Caution! \nNo Backend defined.\n The requested model cannot be loaded. Try to load a configuration with a save plugin.";
// ORYX.I18N.Oryx.pleaseWait = "Please wait while loading...";
ORYX.I18N.Oryx.pleaseWait = '<center>  <img src="'+ORYX.BASE_FILE_PATH+'images/jbpm_logo.png" align="middle"/><b>在线设计器载入中，请稍候...</b></center>';
ORYX.I18N.Oryx.notLoggedOn = "Not logged on";
ORYX.I18N.Oryx.editorOpenTimeout = "在线设计器目前无法启动，请检查是否开启了浏览器的阻止弹出框选项，如果开启了请关闭， 我们的站点不会显示任何广告信息。";

if (!ORYX.I18N.AddDocker)
	ORYX.I18N.AddDocker = {};

ORYX.I18N.AddDocker.group = "Docker";
ORYX.I18N.AddDocker.add = "添加节点";
ORYX.I18N.AddDocker.addDesc = "在连接线上添加一个新的节点, 点击即可.";
ORYX.I18N.AddDocker.del = "删除节点";
ORYX.I18N.AddDocker.delDesc = "在连接线上删除一个已有的节点.";

if (!ORYX.I18N.ShapeConnector)
	ORYX.I18N.ShapeConnector = {};

ORYX.I18N.ShapeConnector.group = "Connector";
ORYX.I18N.ShapeConnector.add = "Connect Shapes";
ORYX.I18N.ShapeConnector.addDesc = "Connect several nodes by marking them in the desired order";

if (!ORYX.I18N.SSExtensionLoader)
	ORYX.I18N.SSExtensionLoader = {};

ORYX.I18N.SSExtensionLoader.group = "Stencil Set";
ORYX.I18N.SSExtensionLoader.add = "Add Stencil Set Extension";
ORYX.I18N.SSExtensionLoader.addDesc = "Add a stencil set extension";
ORYX.I18N.SSExtensionLoader.loading = "Loading Stencil Set Extension";
ORYX.I18N.SSExtensionLoader.noExt = "There are no extensions available or all available extensions are already loaded.";
ORYX.I18N.SSExtensionLoader.failed1 = "Loading stencil set extensions configuration failed. The response is not a valid configuration file.";
ORYX.I18N.SSExtensionLoader.failed2 = "Loading stencil set extension configuration file failed. The request returned an error.";
ORYX.I18N.SSExtensionLoader.panelTitle = "Stencil Set Extensions";
ORYX.I18N.SSExtensionLoader.panelText = "Select the stencil set extensions you want to load.";

if (!ORYX.I18N.AdHocCC)
	ORYX.I18N.AdHocCC = {};

ORYX.I18N.AdHocCC.group = "Ad Hoc";
ORYX.I18N.AdHocCC.compl = "Edit Completion Condition";
ORYX.I18N.AdHocCC.complDesc = "Edit an Ad Hoc Activity's Completion Condition";
ORYX.I18N.AdHocCC.notOne = "Not exactly one element selected!";
ORYX.I18N.AdHocCC.nodAdHocCC = "Selected element has no ad hoc completion condition!";
ORYX.I18N.AdHocCC.selectTask = "Select a task...";
ORYX.I18N.AdHocCC.selectState = "Select a state...";
ORYX.I18N.AdHocCC.addExp = "Add Expression";
ORYX.I18N.AdHocCC.selectDataField = "Select a data field...";
ORYX.I18N.AdHocCC.enterEqual = "Enter a value that must equal...";
ORYX.I18N.AdHocCC.and = "and";
ORYX.I18N.AdHocCC.or = "or";
ORYX.I18N.AdHocCC.not = "not";
ORYX.I18N.AdHocCC.clearCC = "Clear Completion Condition";
ORYX.I18N.AdHocCC.editCC = "Edit Ad-Hoc Completion Condtions";
ORYX.I18N.AdHocCC.addExecState = "Add Execution State Expression: ";
ORYX.I18N.AdHocCC.addDataExp = "Add Data Expression: ";
ORYX.I18N.AdHocCC.addLogOp = "Add Logical Operators: ";
ORYX.I18N.AdHocCC.curCond = "Current Completion Condition: ";

if (!ORYX.I18N.AMLSupport)
	ORYX.I18N.AMLSupport = {};

ORYX.I18N.AMLSupport.group = "EPC";
ORYX.I18N.AMLSupport.imp = "Import AML file";
ORYX.I18N.AMLSupport.impDesc = "Import an Aris 7 AML file";
ORYX.I18N.AMLSupport.failed = "Importing AML file failed. Please check, if the selected file is a valid AML file. Error message: ";
ORYX.I18N.AMLSupport.failed2 = "Importing AML file failed: ";
ORYX.I18N.AMLSupport.noRights = "You have no rights to import multiple EPC-Diagrams (Login required).";
ORYX.I18N.AMLSupport.panelText = "Select an AML (.xml) file to import.";
ORYX.I18N.AMLSupport.file = "File";
ORYX.I18N.AMLSupport.importBtn = "Import AML-File";
ORYX.I18N.AMLSupport.get = "Get diagrams...";
ORYX.I18N.AMLSupport.close = "Close";
ORYX.I18N.AMLSupport.title = "Title";
ORYX.I18N.AMLSupport.selectDiagrams = "Select the diagram(s) you want to import. <br/> If one model is selected, it will be imported in the current editor, if more than one is selected, those models will directly be stored in the repository.";
ORYX.I18N.AMLSupport.impText = "Import";
ORYX.I18N.AMLSupport.impProgress = "Importing...";
ORYX.I18N.AMLSupport.cancel = "Cancel";
ORYX.I18N.AMLSupport.name = "Name";
ORYX.I18N.AMLSupport.allImported = "All imported diagrams.";
ORYX.I18N.AMLSupport.ok = "Ok";

if (!ORYX.I18N.Arrangement)
	ORYX.I18N.Arrangement = {};

ORYX.I18N.Arrangement.groupZ = "Z-Order";
ORYX.I18N.Arrangement.btf = "置于顶层";
ORYX.I18N.Arrangement.btfDesc = "置于顶层";
ORYX.I18N.Arrangement.btb = "置于底层";
ORYX.I18N.Arrangement.btbDesc = "置于底层";
ORYX.I18N.Arrangement.bf = "上移一层";
ORYX.I18N.Arrangement.bfDesc = "上移一层";
ORYX.I18N.Arrangement.bb = "下移一层";
ORYX.I18N.Arrangement.bbDesc = "下移一层";
ORYX.I18N.Arrangement.groupA = "Alignment";
ORYX.I18N.Arrangement.ab = "底端对齐";
ORYX.I18N.Arrangement.abDesc = "底端对齐";
ORYX.I18N.Arrangement.am = "上下居中";
ORYX.I18N.Arrangement.amDesc = "上下居中";
ORYX.I18N.Arrangement.at = "顶端对齐";
ORYX.I18N.Arrangement.atDesc = "顶端对齐";
ORYX.I18N.Arrangement.al = "左对齐";
ORYX.I18N.Arrangement.alDesc = "左对齐";
ORYX.I18N.Arrangement.ac = "左右居中";
ORYX.I18N.Arrangement.acDesc = "左右居中";
ORYX.I18N.Arrangement.ar = "右对齐";
ORYX.I18N.Arrangement.arDesc = "右对齐";
ORYX.I18N.Arrangement.as = "相同大小";
ORYX.I18N.Arrangement.asDesc = "相同大小";

if (!ORYX.I18N.TransformationDownloadDialog)
	ORYX.I18N.TransformationDownloadDialog = {};

ORYX.I18N.TransformationDownloadDialog.error = "Error";
ORYX.I18N.TransformationDownloadDialog.noResult = "The transformation service did not return a result.";
ORYX.I18N.TransformationDownloadDialog.errorParsing = "Error During the Parsing of the Diagram.";
ORYX.I18N.TransformationDownloadDialog.transResult = "Transformation Results";
ORYX.I18N.TransformationDownloadDialog.showFile = "Show the result file";
ORYX.I18N.TransformationDownloadDialog.downloadFile = "Download the result file";
ORYX.I18N.TransformationDownloadDialog.downloadAll = "Download all result files";

if (!ORYX.I18N.DesynchronizabilityOverlay)
	ORYX.I18N.DesynchronizabilityOverlay = {};
// TODO desynchronizability is not a correct term
ORYX.I18N.DesynchronizabilityOverlay.group = "Overlay";
ORYX.I18N.DesynchronizabilityOverlay.name = "Desynchronizability Checker";
ORYX.I18N.DesynchronizabilityOverlay.desc = "Desynchronizability Checker";
ORYX.I18N.DesynchronizabilityOverlay.sync = "The net is desynchronizable.";
ORYX.I18N.DesynchronizabilityOverlay.error = "The net has 1 syntax errors.";
ORYX.I18N.DesynchronizabilityOverlay.invalid = "Invalid answer from server.";

if (!ORYX.I18N.Edit)
	ORYX.I18N.Edit = {};

ORYX.I18N.Edit.group = "Edit";
ORYX.I18N.Edit.cut = "Cut";
ORYX.I18N.Edit.cutDesc = "剪切选择的所有图形到剪贴板";
ORYX.I18N.Edit.copy = "Copy";
ORYX.I18N.Edit.copyDesc = "复制选择的所有图形到剪贴板";
ORYX.I18N.Edit.paste = "Paste";
ORYX.I18N.Edit.pasteDesc = "粘贴剪贴板中的图形到画布";
ORYX.I18N.Edit.del = "Delete";
ORYX.I18N.Edit.delDesc = "删除选择的所有图形";

if (!ORYX.I18N.ShareSupport)
	ORYX.I18N.ShareSupport = {};
ORYX.I18N.ShareSupport.bpmn2Group = "sharegroup";
ORYX.I18N.ShareSupport.bpmn2Name = "查看流程的 BPMN2 Xml 源码";
ORYX.I18N.ShareSupport.bpmn2Desc = "查看 BPMN2 Xml 源码";
ORYX.I18N.ShareSupport.bpmn2ViewTitle = "BPMN2 Xml 源码";
ORYX.I18N.ShareSupport.bpmn2SaveToFile = "保存到文件";
ORYX.I18N.ShareSupport.bpmn2Close = "关闭";


ORYX.I18N.ShareSupport.jsonGroup = "sharegroup";
ORYX.I18N.ShareSupport.jsonName = "查看流程的 JSON 源码";
ORYX.I18N.ShareSupport.jsonDesc = "查看 JSON 源码";
ORYX.I18N.ShareSupport.jsonViewTitle = "BPMN2 Xml 源码";
ORYX.I18N.ShareSupport.jsonSaveToFile = "保存到文件";
ORYX.I18N.ShareSupport.jsonClose = "关闭";


if (!ORYX.I18N.FromBPMN2Support)
	ORYX.I18N.FromBPMN2Support = {};
ORYX.I18N.FromBPMN2Support.group = "importgroup";
ORYX.I18N.FromBPMN2Support.selectFile = "选择一个BPMN2流程定义文件!";
ORYX.I18N.FromBPMN2Support.file = "BPMN2文件";
ORYX.I18N.FromBPMN2Support.impBPMN2 = "从 BPMN2 文件导入";
ORYX.I18N.FromBPMN2Support.impBPMN2Desc = "从已存在的 BPMN2 文件导入 [.bpmn, .bpmn2, .xml]";
ORYX.I18N.FromBPMN2Support.impBtn = "导入";
ORYX.I18N.FromBPMN2Support.impProgress = "导入中...";
ORYX.I18N.FromBPMN2Support.close = "关闭";

if (!ORYX.I18N.FromJSONSupport)
	ORYX.I18N.FromJSONSupport = {};
ORYX.I18N.FromJSONSupport.group = "importgroup";
ORYX.I18N.FromJSONSupport.selectFile = "选择一个在线流程设计器格式的JSON文件!";
ORYX.I18N.FromJSONSupport.file = "JSON文件";
ORYX.I18N.FromJSONSupport.impBPMN2 = "从 JSON 文件导入";
ORYX.I18N.FromJSONSupport.impBPMN2Desc = "从已存在的 JSON 文件导入"; 
ORYX.I18N.FromJSONSupport.impBtn = "导入";
ORYX.I18N.FromJSONSupport.impProgress = "导入中...";
ORYX.I18N.FromJSONSupport.close = "关闭";

ORYX.I18N.FromJSONSupport.impDialogTile = "导入";
ORYX.I18N.FromJSONSupport.impReplaceText = "替换已有的流程定义模型？";


if (!ORYX.I18N.Save)
	ORYX.I18N.Save = {};

ORYX.I18N.Save.group = "File";
ORYX.I18N.Save.save = "保存";
ORYX.I18N.Save.saveAndClose = "保存并关闭";
ORYX.I18N.Save.saveAndCloseDesc = "保存并关闭";
ORYX.I18N.Save.saveAndNewVersion = "保存并发布新版";
ORYX.I18N.Save.saveAndNewVersionDesc = "保存并发布新版";
ORYX.I18N.Save.saveDesc = "保存";
ORYX.I18N.Save.autosave = "自动保存";
ORYX.I18N.Save.autosaveDesc = "自动保存";
ORYX.I18N.Save.autosave_on = "启用自动保存";
ORYX.I18N.Save.autosave_off = "禁用自动保存";
ORYX.I18N.Save.autosaveDesc_on = "启用自动保存";
ORYX.I18N.Save.autosaveDesc_off = "禁用自动保存";
ORYX.I18N.Save.saveAs = "Save As...";
ORYX.I18N.Save.saveAsDesc = "另存为...";
ORYX.I18N.Save.unsavedData = "There are unsaved data, please save before you leave, otherwise your changes get lost!";
ORYX.I18N.Save.newProcess = "New Process";
ORYX.I18N.Save.saveAsTitle = "另存为...";
ORYX.I18N.Save.saveBtn = "保存";
ORYX.I18N.Save.close = "关闭";
ORYX.I18N.Save.savedAs = "Saved As";
ORYX.I18N.Save.saved = "Saved!";
ORYX.I18N.Save.failed = "Saving failed.";
ORYX.I18N.Save.noRights = "You have no rights to save changes.";
ORYX.I18N.Save.saving = "Saving";
ORYX.I18N.Save.saveAsHint = "The process diagram is stored under:";

if (!ORYX.I18N.File)
	ORYX.I18N.File = {};

ORYX.I18N.File.group = "File";
ORYX.I18N.File.print = "Print";
ORYX.I18N.File.printDesc = "Print current model";
ORYX.I18N.File.pdf = "Export as PDF";
ORYX.I18N.File.pdfDesc = "Export as PDF";
ORYX.I18N.File.info = "Info";
ORYX.I18N.File.infoDesc = "Info";
ORYX.I18N.File.genPDF = "Generating PDF";
ORYX.I18N.File.genPDFFailed = "Generating PDF failed.";
ORYX.I18N.File.printTitle = "Print";
ORYX.I18N.File.printMsg = "We are currently experiencing problems with the printing function. We recommend using the PDF Export to print the diagram. Do you really want to continue printing?";

if (!ORYX.I18N.Grouping)
	ORYX.I18N.Grouping = {};

ORYX.I18N.Grouping.grouping = "Grouping";
ORYX.I18N.Grouping.group = "Group";
ORYX.I18N.Grouping.groupDesc = "组合";
ORYX.I18N.Grouping.ungroup = "Ungroup";
ORYX.I18N.Grouping.ungroupDesc = "取消组合";

if (!ORYX.I18N.IBPMN2BPMN)
	ORYX.I18N.IBPMN2BPMN = {};

ORYX.I18N.IBPMN2BPMN.group = "Export";
ORYX.I18N.IBPMN2BPMN.name = "IBPMN 2 BPMN Mapping";
ORYX.I18N.IBPMN2BPMN.desc = "Convert IBPMN to BPMN";

if (!ORYX.I18N.Loading)
	ORYX.I18N.Loading = {};

ORYX.I18N.Loading.waiting = "Please wait...";


if (!ORYX.I18N.PropertyWindow)
	ORYX.I18N.PropertyWindow = {};

ORYX.I18N.PropertyWindow.name = "名称";
ORYX.I18N.PropertyWindow.value = "值";
ORYX.I18N.PropertyWindow.selected = "selected";
ORYX.I18N.PropertyWindow.clickIcon = "Click Icon";
ORYX.I18N.PropertyWindow.add = "添加";
ORYX.I18N.PropertyWindow.add2 = "需选择环节";
ORYX.I18N.PropertyWindow.add2.tooltip = "设置此环节需要用户选择下一步走向";
ORYX.I18N.PropertyWindow.rem = "移除";
ORYX.I18N.PropertyWindow.complex = "复杂类型编辑器";
ORYX.I18N.PropertyWindow.text = "文本编辑器";
ORYX.I18N.PropertyWindow.ok = "确定";
ORYX.I18N.PropertyWindow.cancel = "取消";
ORYX.I18N.PropertyWindow.dateFormat = "m/d/y";

ORYX.I18N.PropertyWindow.expression = "表达式编辑器";


if (!ORYX.I18N.ShapeMenuPlugin)
	ORYX.I18N.ShapeMenuPlugin = {};

ORYX.I18N.ShapeMenuPlugin.drag = "Drag";
ORYX.I18N.ShapeMenuPlugin.clickDrag = "点击或拖动";
ORYX.I18N.ShapeMenuPlugin.morphMsg = "更换类型";

if (!ORYX.I18N.SimplePnmlexport)
	ORYX.I18N.SimplePnmlexport = {};

ORYX.I18N.SimplePnmlexport.group = "Export";
ORYX.I18N.SimplePnmlexport.name = "Export to PNML";
ORYX.I18N.SimplePnmlexport.desc = "Export to PNML";

if (!ORYX.I18N.StepThroughPlugin)
	ORYX.I18N.StepThroughPlugin = {};

ORYX.I18N.StepThroughPlugin.group = "Step Through";
ORYX.I18N.StepThroughPlugin.stepThrough = "Step Through";
ORYX.I18N.StepThroughPlugin.stepThroughDesc = "Step through your model";
ORYX.I18N.StepThroughPlugin.undo = "Undo";
ORYX.I18N.StepThroughPlugin.undoDesc = "Undo one Step";
ORYX.I18N.StepThroughPlugin.error = "Can't step through this diagram.";
ORYX.I18N.StepThroughPlugin.executing = "Executing";

if (!ORYX.I18N.SyntaxChecker)
	ORYX.I18N.SyntaxChecker = {};

ORYX.I18N.SyntaxChecker.group = "Verification";
ORYX.I18N.SyntaxChecker.name = "Validate Process";
ORYX.I18N.SyntaxChecker.desc = "Validate Process";
ORYX.I18N.SyntaxChecker.noErrors = "There are no validation errors.";
ORYX.I18N.SyntaxChecker.invalid = "Invalid answer from server.";
ORYX.I18N.SyntaxChecker.checkingMessage = "校验中 ...";

if (!ORYX.I18N.Undo)
	ORYX.I18N.Undo = {};

ORYX.I18N.Undo.group = "Undo";
ORYX.I18N.Undo.undo = "Undo";
ORYX.I18N.Undo.undoDesc = "撤销最后一次动作";
ORYX.I18N.Undo.redo = "Redo";
ORYX.I18N.Undo.redoDesc = "重做最后一次被撤销的动作";

if (!ORYX.I18N.Validator)
	ORYX.I18N.Validator = {};
ORYX.I18N.Validator.checking = "Checking";

if (!ORYX.I18N.View)
	ORYX.I18N.View = {};

ORYX.I18N.View.group = "Zoom";
ORYX.I18N.View.zoomIn = "Zoom In";
ORYX.I18N.View.zoomInDesc = "放大";
ORYX.I18N.View.zoomOut = "Zoom Out";
ORYX.I18N.View.zoomOutDesc = "缩小";
ORYX.I18N.View.zoomStandard = "Zoom Standard";
ORYX.I18N.View.zoomStandardDesc = "原始大小";
ORYX.I18N.View.zoomFitToModel = "Zoom fit to model";
ORYX.I18N.View.zoomFitToModelDesc = "适应图形";
ORYX.I18N.View.showInPopout = "Popout";
ORYX.I18N.View.showInPopoutDesc = "Show in pop out window";
ORYX.I18N.View.convertToPDF = "PDF";
ORYX.I18N.View.convertToPDFDesc = "Convert to PDF";
ORYX.I18N.View.convertToPNG = "PNG";
ORYX.I18N.View.convertToPNGDesc = "Convert to PNG";
ORYX.I18N.View.generateTaskForms = "Generate Task Form Templates";
ORYX.I18N.View.generateTaskFormsDesc = "Generate Task Form Templates";
ORYX.I18N.View.showInfo = "Info";
ORYX.I18N.View.showInfoDesc = "关于信息";
ORYX.I18N.View.jbpmgroup = "jBPM";

ORYX.I18N.View.viewDiff = "View diff";
ORYX.I18N.View.viewDiffDesc = "View diff between different versions of the process";
ORYX.I18N.View.viewDiffLoadingVersions = "Loading process versions...";
ORYX.I18N.View.connectServiceRepo = "Connect to jBPM service repository";
ORYX.I18N.View.connectServiceRepoDesc = "Connect to a Service Repository";
ORYX.I18N.View.connectServiceRepoDataTitle = "Service Repository Connection";
ORYX.I18N.View.connectServiceRepoConnecting = "Connecting to a Service Repository...";
ORYX.I18N.View.installingRepoItem = "Instaling assets from the Service Repository...";
ORYX.I18N.View.shareProcess = "Share your process";
ORYX.I18N.View.shareProcessDesc = "分享你的流程";
ORYX.I18N.View.infogroup = "info";

ORYX.I18N.View.showInFullscreen = "全屏显示";
ORYX.I18N.View.showInFullscreenDesc = "全屏显示模式";



if (!ORYX.I18N.XFormsSerialization)
	ORYX.I18N.XFormsSerialization = {};

ORYX.I18N.XFormsSerialization.group = "XForms Serialization";
ORYX.I18N.XFormsSerialization.exportXForms = "XForms Export";
ORYX.I18N.XFormsSerialization.exportXFormsDesc = "Export XForms+XHTML markup";
ORYX.I18N.XFormsSerialization.importXForms = "XForms Import";
ORYX.I18N.XFormsSerialization.importXFormsDesc = "Import XForms+XHTML markup";
ORYX.I18N.XFormsSerialization.noClientXFormsSupport = "No XForms support";
ORYX.I18N.XFormsSerialization.noClientXFormsSupportDesc = "<h2>Your browser does not support XForms. Please install the <a href=\"https://addons.mozilla.org/firefox/addon/824\" target=\"_blank\">Mozilla XForms Add-on</a> for Firefox.</h2>";
ORYX.I18N.XFormsSerialization.ok = "Ok";
ORYX.I18N.XFormsSerialization.selectFile = "Select a XHTML (.xhtml) file or type in the XForms+XHTML markup to import it!";
ORYX.I18N.XFormsSerialization.selectCss = "Please insert url of css file";
ORYX.I18N.XFormsSerialization.file = "File";
ORYX.I18N.XFormsSerialization.impFailed = "Request for import of document failed.";
ORYX.I18N.XFormsSerialization.impTitle = "Import XForms+XHTML document";
ORYX.I18N.XFormsSerialization.expTitle = "Export XForms+XHTML document";
ORYX.I18N.XFormsSerialization.impButton = "Import";
ORYX.I18N.XFormsSerialization.impProgress = "Importing...";
ORYX.I18N.XFormsSerialization.close = "Close";

if (!ORYX.I18N.TreeGraphSupport)
	ORYX.I18N.TreeGraphSupport = {};

ORYX.I18N.TreeGraphSupport.syntaxCheckName = "Syntax Check";
ORYX.I18N.TreeGraphSupport.group = "Tree Graph Support";
ORYX.I18N.TreeGraphSupport.syntaxCheckDesc = "Check the syntax of an tree graph structure";

if (!ORYX.I18N.QueryEvaluator)
	ORYX.I18N.QueryEvaluator = {};

ORYX.I18N.QueryEvaluator.name = "Query Evaluator";
ORYX.I18N.QueryEvaluator.group = "Verification";
ORYX.I18N.QueryEvaluator.desc = "Evaluate query";
ORYX.I18N.QueryEvaluator.noResult = "Query resulted in no match.";
ORYX.I18N.QueryEvaluator.invalidResponse = "Invalid answer from server.";

// if(!ORYX.I18N.QueryResultHighlighter) ORYX.I18N.QueryResultHighlighter = {};
// 
// ORYX.I18N.QueryResultHighlighter.name = "Query Result Highlighter";

/** New Language Properties: 08.12.2008 */

ORYX.I18N.PropertyWindow.title = "属性";

if (!ORYX.I18N.ShapeRepository)
	ORYX.I18N.ShapeRepository = {};
ORYX.I18N.ShapeRepository.title = "工具栏";

if (!ORYX.I18N.Perspective)
	ORYX.I18N.Perspective = {};
ORYX.I18N.Perspective.title = "切换视图";
ORYX.I18N.Perspective.emptyText = "请选择一个视图...";

if (!ORYX.I18N.ContentPanel)
	ORYX.I18N.ContentPanel = {};
ORYX.I18N.ContentPanel.modelTitle = "流程设计";

ORYX.I18N.Save.dialogDesciption = "Please enter a name, a description and a comment.";
ORYX.I18N.Save.dialogLabelTitle = "Title";
ORYX.I18N.Save.dialogLabelDesc = "Description";
ORYX.I18N.Save.dialogLabelType = "Type";
ORYX.I18N.Save.dialogLabelComment = "Revision comment";

ORYX.I18N.Validator.name = "BPMN Validator";
ORYX.I18N.Validator.description = "Validation for BPMN";

ORYX.I18N.SSExtensionLoader.labelImport = "Import";
ORYX.I18N.SSExtensionLoader.labelCancel = "Cancel";

Ext.MessageBox.buttonText.yes = "是";
Ext.MessageBox.buttonText.no = "否";
Ext.MessageBox.buttonText.cancel = "取消";
Ext.MessageBox.buttonText.ok = "确定";



/** Resource Perspective Additions: 24 March 2009 */
if (!ORYX.I18N.ResourcesSoDAdd)
	ORYX.I18N.ResourcesSoDAdd = {};

ORYX.I18N.ResourcesSoDAdd.name = "Define Separation of Duties Contraint";
ORYX.I18N.ResourcesSoDAdd.group = "Resource Perspective";
ORYX.I18N.ResourcesSoDAdd.desc = "Define a Separation of Duties constraint for the selected tasks";

if (!ORYX.I18N.ResourcesSoDShow)
	ORYX.I18N.ResourcesSoDShow = {};

ORYX.I18N.ResourcesSoDShow.name = "Show Separation of Duties Constraints";
ORYX.I18N.ResourcesSoDShow.group = "Resource Perspective";
ORYX.I18N.ResourcesSoDShow.desc = "Show Separation of Duties constraints of the selected task";

if (!ORYX.I18N.ResourcesBoDAdd)
	ORYX.I18N.ResourcesBoDAdd = {};

ORYX.I18N.ResourcesBoDAdd.name = "Define Binding of Duties Constraint";
ORYX.I18N.ResourcesBoDAdd.group = "Resource Perspective";
ORYX.I18N.ResourcesBoDAdd.desc = "Define a Binding of Duties Constraint for the selected tasks";

if (!ORYX.I18N.ResourcesBoDShow)
	ORYX.I18N.ResourcesBoDShow = {};

ORYX.I18N.ResourcesBoDShow.name = "Show Binding of Duties Constraints";
ORYX.I18N.ResourcesBoDShow.group = "Resource Perspective";
ORYX.I18N.ResourcesBoDShow.desc = "Show Binding of Duties constraints of the selected task";

if (!ORYX.I18N.ResourceAssignment)
	ORYX.I18N.ResourceAssignment = {};

ORYX.I18N.ResourceAssignment.name = "Resource Assignment";
ORYX.I18N.ResourceAssignment.group = "Resource Perspective";
ORYX.I18N.ResourceAssignment.desc = "Assign resources to the selected task(s)";

if (!ORYX.I18N.ClearSodBodHighlights)
	ORYX.I18N.ClearSodBodHighlights = {};

ORYX.I18N.ClearSodBodHighlights.name = "Clear Highlights and Overlays";
ORYX.I18N.ClearSodBodHighlights.group = "Resource Perspective";
ORYX.I18N.ClearSodBodHighlights.desc = "Remove all Separation and Binding of Duties Highlights/ Overlays";

if (!ORYX.I18N.Perspective)
	ORYX.I18N.Perspective = {};
ORYX.I18N.Perspective.no = "No Perspective"
ORYX.I18N.Perspective.noTip = "Unload the current perspective"

/** New Language Properties: 21.04.2009 */
ORYX.I18N.JSONSupport = {
	imp : {
		name : "Import from JSON",
		desc : "Imports a model from JSON",
		group : "Export",
		selectFile : "Select an JSON (.json) file or type in JSON to import it!",
		file : "File",
		btnImp : "Import",
		btnClose : "Close",
		progress : "Importing ...",
		syntaxError : "Syntax error"
	},
	exp : {
		name : "Export to JSON",
		desc : "Exports current model to JSON",
		group : "Export"
	}
};

ORYX.I18N.TBPMSupport = {
	imp : {
		name : "Import from PNG/JPEG",
		desc : "Imports a model from a TPBM photo",
		group : "Export",
		selectFile : "Select an image (.png/.jpeg) file!",
		file : "File",
		btnImp : "Import",
		btnClose : "Close",
		progress : "Importing ...",
		syntaxError : "Syntax error",
		impFailed : "Request for import of document failed.",
		confirm : "Confirm import of highlighted shapes!"
	}
};

/** New Language Properties: 08.05.2009 */
if (!ORYX.I18N.BPMN2XHTML)
	ORYX.I18N.BPMN2XHTML = {};
ORYX.I18N.BPMN2XHTML.group = "Export";
ORYX.I18N.BPMN2XHTML.XHTMLExport = "Export XHTML Documentation";

/** New Language Properties: 09.05.2009 */
if (!ORYX.I18N.JSONImport)
	ORYX.I18N.JSONImport = {};

ORYX.I18N.JSONImport.title = "JSON Import";
ORYX.I18N.JSONImport.wrongSS = "The stencil set of the imported file ({0}) does not match to the loaded stencil set ({1}).";
ORYX.I18N.JSONImport.invalidJSON = "The JSON to import is invalid.";

if (!ORYX.I18N.Feedback)
	ORYX.I18N.Feedback = {};

ORYX.I18N.Feedback.name = "Feedback";
ORYX.I18N.Feedback.desc = "Contact us for any kind of feedback!";
ORYX.I18N.Feedback.pTitle = "Contact us for any kind of feedback!";
ORYX.I18N.Feedback.pName = "Name";
ORYX.I18N.Feedback.pEmail = "E-Mail";
ORYX.I18N.Feedback.pSubject = "Subject";
ORYX.I18N.Feedback.pMsg = "Description/Message";
ORYX.I18N.Feedback.pEmpty = "* Please provide as detailed information as possible so that we can understand your request.\n* For bug reports, please list the steps how to reproduce the problem and describe the output you expected.";
ORYX.I18N.Feedback.pAttach = "Attach current model";
ORYX.I18N.Feedback.pAttachDesc = "This information can be helpful for debugging purposes. If your model contains some sensitive data, remove it before or uncheck this behavior.";
ORYX.I18N.Feedback.pBrowser = "Information about your browser and environment";
ORYX.I18N.Feedback.pBrowserDesc = "This information has been auto-detected from your browser. It can be helpful if you encountered a bug associated with browser-specific behavior.";
ORYX.I18N.Feedback.submit = "Send Message";
ORYX.I18N.Feedback.sending = "Sending message ...";
ORYX.I18N.Feedback.success = "Success";
ORYX.I18N.Feedback.successMsg = "Thank you for your feedback!";
ORYX.I18N.Feedback.failure = "Failure";
ORYX.I18N.Feedback.failureMsg = "Unfortunately, the message could not be sent. This is our fault! Please try again or contact someone at http://code.google.com/p/oryx-editor/";

ORYX.I18N.Feedback.name = "Feedback";
ORYX.I18N.Feedback.failure = "Failure";
ORYX.I18N.Feedback.failureMsg = "Unfortunately, the message could not be sent. This is our fault! Please try again or contact someone at http://code.google.com/p/oryx-editor/";
ORYX.I18N.Feedback.submit = "Send Message";

ORYX.I18N.Feedback.emailDesc = "Your e-mail address?";
ORYX.I18N.Feedback.titleDesc = "Summarize your message with a short title";
ORYX.I18N.Feedback.descriptionDesc = "Describe your idea, question, or problem."
ORYX.I18N.Feedback.info = '<p>Oryx is a research platform intended to support scientists in the field of business process management and beyond with a flexible, extensible tool to validate research theses and conduct experiments.</p><p>We are happy to provide you with the <a href="http://bpt.hpi.uni-potsdam.de/Oryx/ReleaseNotes" target="_blank"> latest technology and advancements</a> of our platform. <a href="http://bpt.hpi.uni-potsdam.de/Oryx/DeveloperNetwork" target="_blank">We</a> work hard to provide you with a reliable system, even though you may experience small hiccups from time to time.</p><p>If you have ideas how to improve Oryx, have a question related to the platform, or want to report a problem: <strong>Please, let us know. Here.</strong></p>'; // general
																																																																																																																																																																																																// info
																																																																																																																																																																																																// will
																																																																																																																																																																																																// be
																																																																																																																																																																																																// shown,
																																																																																																																																																																																																// if
																																																																																																																																																																																																// no
																																																																																																																																																																																																// subject
																																																																																																																																																																																																// specific
																																																																																																																																																																																																// info
																																																																																																																																																																																																// is
																																																																																																																																																																																																// given
// list subjects in reverse order of appearance!
ORYX.I18N.Feedback.subjects = [
		{
			id : "question", // ansi-compatible name
			name : "Question", // natural name
			description : "Ask your question here! \nPlease give us as much information as possible, so we don't have to bother you with more questions, before we can give an answer.", // default
																																															// text
																																															// for
																																															// the
																																															// description
																																															// text
																																															// input
																																															// field
			info : "" // optional field to give more info
		},
		{
			id : "problem", // ansi-compatible name
			name : "Problem", // natural name
			description : "We're sorry for the inconvenience. Give us feedback on the problem, and we'll try to solve it for you. Describe it as detailed as possible, please.", // default
																																													// text
																																													// for
																																													// the
																																													// description
																																													// text
																																													// input
																																													// field
			info : "" // optional field to give more info
		}, {
			id : "idea", // ansi-compatible name
			name : "Idea", // natural name
			description : "Share your ideas and thoughts here!", // default
																	// text for
																	// the
																	// description
																	// text
																	// input
																	// field
			info : "" // optional field to give more info
		} ];


/** New Language Properties: 15.05.2009 */
if (!ORYX.I18N.SyntaxChecker.BPMN)
	ORYX.I18N.SyntaxChecker.BPMN = {};
ORYX.I18N.SyntaxChecker.BPMN_NO_SOURCE = "An edge must have a source.";
ORYX.I18N.SyntaxChecker.BPMN_NO_TARGET = "An edge must have a target.";
ORYX.I18N.SyntaxChecker.BPMN_DIFFERENT_PROCESS = "Source and target node must be contained in the same process.";
ORYX.I18N.SyntaxChecker.BPMN_SAME_PROCESS = "Source and target node must be contained in different pools.";
ORYX.I18N.SyntaxChecker.BPMN_FLOWOBJECT_NOT_CONTAINED_IN_PROCESS = "A flow object must be contained in a process.";
ORYX.I18N.SyntaxChecker.BPMN_ENDEVENT_WITHOUT_INCOMING_CONTROL_FLOW = "An end event must have an incoming sequence flow.";
ORYX.I18N.SyntaxChecker.BPMN_STARTEVENT_WITHOUT_OUTGOING_CONTROL_FLOW = "A start event must have an outgoing sequence flow.";
ORYX.I18N.SyntaxChecker.BPMN_STARTEVENT_WITH_INCOMING_CONTROL_FLOW = "Start events must not have incoming sequence flows.";
ORYX.I18N.SyntaxChecker.BPMN_ATTACHEDINTERMEDIATEEVENT_WITH_INCOMING_CONTROL_FLOW = "Attached intermediate events must not have incoming sequence flows.";
ORYX.I18N.SyntaxChecker.BPMN_ATTACHEDINTERMEDIATEEVENT_WITHOUT_OUTGOING_CONTROL_FLOW = "Attached intermediate events must have exactly one outgoing sequence flow.";
ORYX.I18N.SyntaxChecker.BPMN_ENDEVENT_WITH_OUTGOING_CONTROL_FLOW = "End events must not have outgoing sequence flows.";
ORYX.I18N.SyntaxChecker.BPMN_EVENTBASEDGATEWAY_BADCONTINUATION = "Event-based gateways must not be followed by gateways or subprocesses.";
ORYX.I18N.SyntaxChecker.BPMN_NODE_NOT_ALLOWED = "Node type is not allowed.";

if (!ORYX.I18N.SyntaxChecker.IBPMN)
	ORYX.I18N.SyntaxChecker.IBPMN = {};
ORYX.I18N.SyntaxChecker.IBPMN_NO_ROLE_SET = "Interactions must have a sender and a receiver role set";
ORYX.I18N.SyntaxChecker.IBPMN_NO_INCOMING_SEQFLOW = "This node must have incoming sequence flow.";
ORYX.I18N.SyntaxChecker.IBPMN_NO_OUTGOING_SEQFLOW = "This node must have outgoing sequence flow.";

if (!ORYX.I18N.SyntaxChecker.InteractionNet)
	ORYX.I18N.SyntaxChecker.InteractionNet = {};
ORYX.I18N.SyntaxChecker.InteractionNet_SENDER_NOT_SET = "Sender not set";
ORYX.I18N.SyntaxChecker.InteractionNet_RECEIVER_NOT_SET = "Receiver not set";
ORYX.I18N.SyntaxChecker.InteractionNet_MESSAGETYPE_NOT_SET = "Message type not set";
ORYX.I18N.SyntaxChecker.InteractionNet_ROLE_NOT_SET = "Role not set";

if (!ORYX.I18N.SyntaxChecker.EPC)
	ORYX.I18N.SyntaxChecker.EPC = {};
ORYX.I18N.SyntaxChecker.EPC_NO_SOURCE = "Each edge must have a source.";
ORYX.I18N.SyntaxChecker.EPC_NO_TARGET = "Each edge must have a target.";
ORYX.I18N.SyntaxChecker.EPC_NOT_CONNECTED = "Node must be connected with edges.";
ORYX.I18N.SyntaxChecker.EPC_NOT_CONNECTED_2 = "Node must be connected with more edges.";
ORYX.I18N.SyntaxChecker.EPC_TOO_MANY_EDGES = "Node has too many connected edges.";
ORYX.I18N.SyntaxChecker.EPC_NO_CORRECT_CONNECTOR = "Node is no correct connector.";
ORYX.I18N.SyntaxChecker.EPC_MANY_STARTS = "There must be only one start event.";
ORYX.I18N.SyntaxChecker.EPC_FUNCTION_AFTER_OR = "There must be no functions after a splitting OR/XOR.";
ORYX.I18N.SyntaxChecker.EPC_PI_AFTER_OR = "There must be no process interface after a splitting OR/XOR.";
ORYX.I18N.SyntaxChecker.EPC_FUNCTION_AFTER_FUNCTION = "There must be no function after a function.";
ORYX.I18N.SyntaxChecker.EPC_EVENT_AFTER_EVENT = "There must be no event after an event.";
ORYX.I18N.SyntaxChecker.EPC_PI_AFTER_FUNCTION = "There must be no process interface after a function.";
ORYX.I18N.SyntaxChecker.EPC_FUNCTION_AFTER_PI = "There must be no function after a process interface.";

if (!ORYX.I18N.SyntaxChecker.PetriNet)
	ORYX.I18N.SyntaxChecker.PetriNet = {};
ORYX.I18N.SyntaxChecker.PetriNet_NOT_BIPARTITE = "The graph is not bipartite";
ORYX.I18N.SyntaxChecker.PetriNet_NO_LABEL = "Label not set for a labeled transition";
ORYX.I18N.SyntaxChecker.PetriNet_NO_ID = "There is a node without id";
ORYX.I18N.SyntaxChecker.PetriNet_SAME_SOURCE_AND_TARGET = "Two flow relationships have the same source and target";
ORYX.I18N.SyntaxChecker.PetriNet_NODE_NOT_SET = "A node is not set for a flowrelationship";

/** New Language Properties: 02.06.2009 */
ORYX.I18N.Edge = "Edge";
ORYX.I18N.Node = "Node";

/** New Language Properties: 03.06.2009 */
ORYX.I18N.SyntaxChecker.notice = "Move the mouse over a red cross icon to see the error message.";

ORYX.I18N.Validator.result = "Validation Result";
ORYX.I18N.Validator.noErrors = "No validation errors found.";
ORYX.I18N.Validator.bpmnDeadlockTitle = "Deadlock";
ORYX.I18N.Validator.bpmnDeadlock = "This node results in a deadlock. There are situations where not all incoming branches are activated.";
ORYX.I18N.Validator.bpmnUnsafeTitle = "Lack of synchronization";
ORYX.I18N.Validator.bpmnUnsafe = "This model suffers from lack of synchronization. The marked element is activated from multiple incoming branches.";
ORYX.I18N.Validator.bpmnLeadsToNoEndTitle = "Validation Result";
ORYX.I18N.Validator.bpmnLeadsToNoEnd = "The process will never reach a final state.";

ORYX.I18N.Validator.syntaxErrorsTitle = "Syntax Error";
ORYX.I18N.Validator.syntaxErrorsMsg = "The process cannot be validated because it contains syntax errors.";

ORYX.I18N.Validator.error = "Validation failed";
ORYX.I18N.Validator.errorDesc = 'We are sorry, but the validation of your process failed. It would help us identifying the problem, if you sent us your process model via the "Send Feedback" function.';

ORYX.I18N.Validator.epcIsSound = "<p><b>The EPC is sound, no problems found!</b></p>";
ORYX.I18N.Validator.epcNotSound = "<p><b>The EPC is <i>NOT</i> sound!</b></p>";

/** New Language Properties: 05.06.2009 */
if (!ORYX.I18N.RESIZE)
	ORYX.I18N.RESIZE = {};
ORYX.I18N.RESIZE.tipGrow = "增加画布的大小：";
ORYX.I18N.RESIZE.tipShrink = "减少画布的大小：";
ORYX.I18N.RESIZE.N = "上";
ORYX.I18N.RESIZE.W = "左";
ORYX.I18N.RESIZE.S = "下";
ORYX.I18N.RESIZE.E = "右";
/** New Language Properties: 14.08.2009 */
if (!ORYX.I18N.PluginLoad)
	ORYX.I18N.PluginLoad = {};
ORYX.I18N.PluginLoad.AddPluginButtonName = "Add Plugins";
ORYX.I18N.PluginLoad.AddPluginButtonDesc = "Add additional Plugins dynamically";
ORYX.I18N.PluginLoad.loadErrorTitle = "Loading Error";
ORYX.I18N.PluginLoad.loadErrorDesc = "Unable to load Plugin. \n Error:\n";
ORYX.I18N.PluginLoad.WindowTitle = "Add additional Plugins";

ORYX.I18N.PluginLoad.NOTUSEINSTENCILSET = "Not allowed in this Stencilset!";
ORYX.I18N.PluginLoad.REQUIRESTENCILSET = "Require another Stencilset!";
ORYX.I18N.PluginLoad.NOTFOUND = "Pluginname not found!"
ORYX.I18N.PluginLoad.YETACTIVATED = "Plugin is yet activated!"

/** New Language Properties: 15.07.2009 */
if (!ORYX.I18N.Layouting)
	ORYX.I18N.Layouting = {};
ORYX.I18N.Layouting.doing = "Layouting...";

/** New Language Properties: 18.08.2009 */
ORYX.I18N.SyntaxChecker.MULT_ERRORS = "Multiple Errors";

/** New Language Properties: 08.09.2009 */
if (!ORYX.I18N.PropertyWindow)
	ORYX.I18N.PropertyWindow = {};
ORYX.I18N.PropertyWindow.oftenUsed = "基本";
ORYX.I18N.PropertyWindow.moreProps = "更多";
ORYX.I18N.PropertyWindow.simulationProps = "模拟";
ORYX.I18N.PropertyWindow.displayProps = "图形设置";

ORYX.I18N.PropertyWindow.Grouping = {
	"popular": "1.基本",
	"extra": "3.更多",
	"actor": "2.参与者",	
	"mi": "4.多实例",
	"event": "5.事件"
}

/** New Language Properties: 17.09.2009 */
if (!ORYX.I18N.Bpmn2_0Serialization)
	ORYX.I18N.Bpmn2_0Serialization = {};
ORYX.I18N.Bpmn2_0Serialization.show = "Show BPMN 2.0 DI XML";
ORYX.I18N.Bpmn2_0Serialization.showDesc = "Show BPMN 2.0 DI XML of the current BPMN 2.0 model";
ORYX.I18N.Bpmn2_0Serialization.download = "Download BPMN 2.0 DI XML";
ORYX.I18N.Bpmn2_0Serialization.downloadDesc = "Download BPMN 2.0 DI XML of the current BPMN 2.0 model";
ORYX.I18N.Bpmn2_0Serialization.serialFailed = "An error occurred while generating the BPMN 2.0 DI XML Serialization.";
ORYX.I18N.Bpmn2_0Serialization.group = "BPMN 2.0";

/** New Language Properties 01.10.2009 */
if (!ORYX.I18N.SyntaxChecker.BPMN2)
	ORYX.I18N.SyntaxChecker.BPMN2 = {};

ORYX.I18N.SyntaxChecker.BPMN2_DATA_INPUT_WITH_INCOMING_DATA_ASSOCIATION = "A Data Input must not have any incoming Data Associations.";
ORYX.I18N.SyntaxChecker.BPMN2_DATA_OUTPUT_WITH_OUTGOING_DATA_ASSOCIATION = "A Data Output must not have any outgoing Data Associations.";
ORYX.I18N.SyntaxChecker.BPMN2_EVENT_BASED_TARGET_WITH_TOO_MANY_INCOMING_SEQUENCE_FLOWS = "Targets of Event-based Gateways may only have one incoming Sequence Flow.";

/** New Language Properties 02.10.2009 */
ORYX.I18N.SyntaxChecker.BPMN2_EVENT_BASED_WITH_TOO_LESS_OUTGOING_SEQUENCE_FLOWS = "An Event-based Gateway must have two or more outgoing Sequence Flows.";
ORYX.I18N.SyntaxChecker.BPMN2_EVENT_BASED_EVENT_TARGET_CONTRADICTION = "If Message Intermediate Events are used in the configuration, then Receive Tasks must not be used and vice versa.";
ORYX.I18N.SyntaxChecker.BPMN2_EVENT_BASED_WRONG_TRIGGER = "Only the following Intermediate Event triggers are valid: Message, Signal, Timer, Conditional and Multiple.";
ORYX.I18N.SyntaxChecker.BPMN2_EVENT_BASED_WRONG_CONDITION_EXPRESSION = "The outgoing Sequence Flows of the Event Gateway must not have a condition expression.";
ORYX.I18N.SyntaxChecker.BPMN2_EVENT_BASED_NOT_INSTANTIATING = "The Gateway does not meet the conditions to instantiate the process. Please use a start event or an instantiating attribute for the gateway.";

/** New Language Properties 05.10.2009 */
ORYX.I18N.SyntaxChecker.BPMN2_GATEWAYDIRECTION_MIXED_FAILURE = "The Gateway must have both multiple incoming and outgoing Sequence Flows.";
ORYX.I18N.SyntaxChecker.BPMN2_GATEWAYDIRECTION_CONVERGING_FAILURE = "The Gateway must have multiple incoming but most NOT have multiple outgoing Sequence Flows.";
ORYX.I18N.SyntaxChecker.BPMN2_GATEWAYDIRECTION_DIVERGING_FAILURE = "The Gateway must NOT have multiple incoming but must have multiple outgoing Sequence Flows.";
ORYX.I18N.SyntaxChecker.BPMN2_GATEWAY_WITH_NO_OUTGOING_SEQUENCE_FLOW = "A Gateway must have a minimum of one outgoing Sequence Flow.";
ORYX.I18N.SyntaxChecker.BPMN2_RECEIVE_TASK_WITH_ATTACHED_EVENT = "Receive Tasks used in Event Gateway configurations must not have any attached Intermediate Events.";
ORYX.I18N.SyntaxChecker.BPMN2_EVENT_SUBPROCESS_BAD_CONNECTION = "An Event Subprocess must not have any incoming or outgoing Sequence Flow.";

/** New Language Properties 13.10.2009 */
ORYX.I18N.SyntaxChecker.BPMN_MESSAGE_FLOW_NOT_CONNECTED = "At least one side of the Message Flow has to be connected.";

/** New Language Properties 19.10.2009 */
ORYX.I18N.Bpmn2_0Serialization['import'] = "Import from BPMN 2.0 DI XML";
ORYX.I18N.Bpmn2_0Serialization.importDesc = "Import a BPMN 2.0 model from a file or XML String";
ORYX.I18N.Bpmn2_0Serialization.selectFile = "Select a (*.bpmn) file or type in BPMN 2.0 DI XML to import it!";
ORYX.I18N.Bpmn2_0Serialization.file = "File:";
ORYX.I18N.Bpmn2_0Serialization.name = "Import from BPMN 2.0 DI XML";
ORYX.I18N.Bpmn2_0Serialization.btnImp = "Import";
ORYX.I18N.Bpmn2_0Serialization.progress = "Importing BPMN 2.0 DI XML ...";
ORYX.I18N.Bpmn2_0Serialization.btnClose = "Close";
ORYX.I18N.Bpmn2_0Serialization.error = "An error occurred while importing BPMN 2.0 DI XML";

/** New Language Properties 24.11.2009 */
ORYX.I18N.SyntaxChecker.BPMN2_TOO_MANY_INITIATING_MESSAGES = "A Choreography Activity may only have one initiating message.";
ORYX.I18N.SyntaxChecker.BPMN_MESSAGE_FLOW_NOT_ALLOWED = "A Message Flow is not allowed here.";

/** New Language Properties 27.11.2009 */
ORYX.I18N.SyntaxChecker.BPMN2_EVENT_BASED_WITH_TOO_LESS_INCOMING_SEQUENCE_FLOWS = "An Event-based Gateway that is not instantiating must have a minimum of one incoming Sequence Flow.";
ORYX.I18N.SyntaxChecker.BPMN2_TOO_FEW_INITIATING_PARTICIPANTS = "A Choreography Activity must have one initiating Participant (white).";
ORYX.I18N.SyntaxChecker.BPMN2_TOO_MANY_INITIATING_PARTICIPANTS = "A Choreography Acitivity must not have more than one initiating Participant (white)."

ORYX.I18N.SyntaxChecker.COMMUNICATION_AT_LEAST_TWO_PARTICIPANTS = "The communication must be connected to at least two participants.";
ORYX.I18N.SyntaxChecker.MESSAGEFLOW_START_MUST_BE_PARTICIPANT = "The message flow's source must be a participant.";
ORYX.I18N.SyntaxChecker.MESSAGEFLOW_END_MUST_BE_PARTICIPANT = "The message flow's target must be a participant.";
ORYX.I18N.SyntaxChecker.CONV_LINK_CANNOT_CONNECT_CONV_NODES = "The conversation link must connect a communication or sub conversation node with a participant.";

/** New Language Properties 30.12.2009 */
ORYX.I18N.Bpmn2_0Serialization.xpdlShow = "Show XPDL 2.2";
ORYX.I18N.Bpmn2_0Serialization.xpdlShowDesc = "Shows the XPDL 2.2 based on BPMN 2.0 XML (by XSLT)";
ORYX.I18N.Bpmn2_0Serialization.xpdlDownload = "Download as XPDL 2.2";
ORYX.I18N.Bpmn2_0Serialization.xpdlDownloadDesc = "Download the XPDL 2.2 based on BPMN 2.0 XML (by XSLT)";
/** new added for businessPropertySetup**/
ORYX.I18N.BPS={};
ORYX.I18N.BPS.group = "BProps";
ORYX.I18N.BPS.processConfig = "流程属性";
ORYX.I18N.BPS.processConfigDesc = "配置流程业务属性";
ORYX.I18N.BPS.activityConfig = "环节属性";
ORYX.I18N.BPS.activityConfigDesc = "配置环节业务属性";
ORYX.I18N.BPS.saveProcDefDesc = "请保存流程定义后再编辑流程业务属性";
ORYX.I18N.BPS.activityPropEditNotNullIdDesc = "环节id不能为空，请填写环节id或者保存流程定义后再修改环节业务属性";
ORYX.I18N.BPS.activityIdNonNull = "环节id不能为空!";
ORYX.I18N.ALERT={};
ORYX.I18N.ALERT.info="提示";