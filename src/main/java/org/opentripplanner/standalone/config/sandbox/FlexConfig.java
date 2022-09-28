package org.opentripplanner.standalone.config.sandbox;

import org.opentripplanner.ext.flex.FlexParameters;
import org.opentripplanner.routing.api.request.preference.RoutingPreferences;
import org.opentripplanner.standalone.config.framework.json.NodeAdapter;

public class FlexConfig {

  public static final int DEFAULT_MAX_TRANSFER_SECONDS = 60 * 5; // 5 minutes
  public final int maxTransferSeconds;

  public FlexConfig(NodeAdapter json) {
    maxTransferSeconds = json.asInt("maxTransferDurationSeconds", DEFAULT_MAX_TRANSFER_SECONDS);
  }

  public FlexParameters toFlexParameters(RoutingPreferences preferences) {
    return new FlexParameters((maxTransferSeconds * preferences.walk().speed()));
  }
}
