// tslint:disable-next-line: class-name
export class appConstant {

  // Db variable for db based connection
  public static couchDBStaticName = 'CouchDB';
  public static pouchDBStaticName = 'PouchDB';
  public static jsonDBStaticName = 'JsonDB';

  // Application Constants
  public static noInternet = 'No internet';
  public static inValidInput = 'Invalid input';
  public static failed = 'failed';
  public static pfmPouchLatestSeqence = '_local/pfm_mobile_platform_last_sequence';
  public static attachmentPouchLatestSeqence = '_local/pfm_mobile_file_manage_last_sequence';
  public static metaPouchLatestSeqence = '_local/meta_data_last_sequence';
  public static statusWFPouchLatestSeqence = '_local/status_workflow_last_sequence';
  public static stageFourProcessingMsg = 'Stage 4 Processing'
  public static syncEnabledObjectDocName = '_local/pfm_sync_enabled_objects'
  public static syncEnabledAttachmentObjectDocName = '_local/pfm_sync_enabled_attachment_objects'
  public static syncEnabledFormulaObjectDocName = '_local/pfm_sync_enabled_formula_objects'
  public static oneToOne = 'one_to_one';
  public static oneToMany = 'one_to_many';
  
  // Used for handling org timezone
  public static orgTimeZoneDateFormat = "yyyy-MM-dd"

    // Attachments Constants
    public static fileType = {
      attachment : "ATTACHMENTS",
      document : "DOCUMENTS"
    }
  public static customFieldSuffix = {
    formula: '__f',
    rollup_summary: '__r',
    slickgrid: '__s',
    developer_template: '__c',
  }
}
